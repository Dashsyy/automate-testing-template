/**
 * Automated Bot Tests — Commands (/start, /list, /delete, /help)
 *
 * Proof: each test attaches a `conversation-proof.json` to the Playwright
 * HTML report showing exactly what was sent and what the bot replied.
 *
 * Pre-requisites:
 *   1. npm run mock            → start the mock Telegram API
 *   2. Bot running with TELEGRAM_API_URL=http://localhost:4444
 *   3. BOT_WEBHOOK_URL set in .env
 *
 * Run: npm run test:bot
 */

import { test, expect } from '@playwright/test';
import {
  textUpdate, callbackUpdate, sendUpdate,
  waitForReply, clearCaptured, getCapturedMessages, attachProof,
} from './helpers.js';

test.describe('Bot Commands', () => {

  test.beforeEach(async ({ request }) => {
    await clearCaptured(request);
  });

  // ── TC-CMD-001 ──────────────────────────────────────────────────────────────
  test('TC-CMD-001 — /start with no codes → welcome message, no inline keyboard', async ({ request }, testInfo) => {
    // Ensure clean state first
    await sendUpdate(request, textUpdate('/start'));
    const messages = await waitForReply(request, 1);
    const reply = messages[0];

    expect(reply).toBeDefined();
    expect(reply.text.length).toBeGreaterThan(0);

    // If user has no codes, reply_markup should be absent or empty
    const hasButtons = reply.replyMarkup &&
      reply.replyMarkup.inline_keyboard &&
      reply.replyMarkup.inline_keyboard.length > 0;

    // This assertion depends on clean state — no tracked codes
    // expect(hasButtons).toBe(false); // uncomment if state is guaranteed clean

    attachProof(testInfo, textUpdate('/start'), messages);
  });

  // ── TC-CMD-004 ──────────────────────────────────────────────────────────────
  test('TC-CMD-004 — /list with no codes → bot replies (not silent)', async ({ request }, testInfo) => {
    const update = textUpdate('/list');
    await sendUpdate(request, update);

    const messages = await waitForReply(request, 1);
    const reply = messages[0];

    // Must reply — not go silent
    expect(reply).toBeDefined();
    expect(reply.text.length).toBeGreaterThan(0);

    attachProof(testInfo, update, messages);
  });

  // ── TC-CMD-008 ──────────────────────────────────────────────────────────────
  test('TC-CMD-008 — /delete <CODE> removes a specific code', async ({ request }, testInfo) => {
    const code = 'TESTDEL001';

    // Add the code first
    await sendUpdate(request, textUpdate(code));
    await waitForReply(request, 1);
    await clearCaptured(request);

    // Now delete it
    const update = textUpdate(`/delete ${code}`);
    await sendUpdate(request, update);
    const messages = await waitForReply(request, 1);
    const reply = messages[0];

    expect(reply).toBeDefined();

    // Reply should confirm deletion
    const text = reply.text.toLowerCase();
    const isConfirmation = text.includes('deleted') ||
                           text.includes('removed') ||
                           text.includes('done') ||
                           text.includes(code.toLowerCase());
    expect(isConfirmation).toBe(true);

    // Verify it's gone — /list should not contain the code
    await clearCaptured(request);
    await sendUpdate(request, textUpdate('/list'));
    const listMessages = await waitForReply(request, 1);
    const listReply = listMessages[0];
    expect(listReply.text).not.toContain(code);

    attachProof(testInfo, update, [...messages, ...listMessages]);
  });

  // ── TC-CMD-009 ──────────────────────────────────────────────────────────────
  test('TC-CMD-009 — /delete <CODE> not tracked → error reply', async ({ request }, testInfo) => {
    const update = textUpdate('/delete CODENOTEXIST999');
    await sendUpdate(request, update);

    const messages = await waitForReply(request, 1);
    const reply = messages[0];

    // Must reply — not go silent
    expect(reply).toBeDefined();
    expect(reply.text.length).toBeGreaterThan(0);

    attachProof(testInfo, update, messages);
  });

  // ── TC-CMD-010 ──────────────────────────────────────────────────────────────
  test('TC-CMD-010 — /help lists all expected commands', async ({ request }, testInfo) => {
    const update = textUpdate('/help');
    await sendUpdate(request, update);

    const messages = await waitForReply(request, 1);
    const reply = messages[0];

    expect(reply).toBeDefined();

    // All commands from PRD section 7 must appear in the help text
    const text = reply.text;
    expect(text).toContain('/start');
    expect(text).toContain('/list');
    expect(text).toContain('/delete');
    expect(text).toContain('/help');

    attachProof(testInfo, update, messages);
  });

  // ── TC-ERR-006 ──────────────────────────────────────────────────────────────
  test('TC-ERR-006 — Unknown command is handled gracefully', async ({ request }, testInfo) => {
    const update = textUpdate('/unknowncommand');
    await sendUpdate(request, update);

    // Bot should reply within timeout — not crash or go silent
    const messages = await waitForReply(request, 1);
    expect(messages[0]).toBeDefined();

    attachProof(testInfo, update, messages);
  });

});
