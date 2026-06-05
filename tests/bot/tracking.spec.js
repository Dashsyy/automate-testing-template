/**
 * Automated Bot Tests — Manual Tracking & Rate Limiting
 *
 * Proof: each test attaches a `conversation-proof.json` to the Playwright
 * HTML report showing exactly what was sent and what the bot replied.
 *
 * Pre-requisites:
 *   1. npm run mock            → start the mock Telegram API
 *   2. Bot running with TELEGRAM_API_URL=http://localhost:4444
 *   3. BOT_WEBHOOK_URL set in .env
 *   4. CE_VALID_TRACKING_CODE set in .env
 *
 * Run: npm run test:bot
 */

import { test, expect } from '@playwright/test';
import {
  textUpdate, sendUpdate, waitForReply,
  clearCaptured, getCapturedMessages, attachProof,
} from './helpers.js';
import 'dotenv/config';

const VALID_CODE   = process.env.CE_VALID_TRACKING_CODE;
const INVALID_CODE = 'INVALIDCODE000';

test.describe('Tracking & Rate Limiting', () => {

  test.beforeEach(async ({ request }) => {
    await clearCaptured(request);
  });

  // ── TC-TRACK-001 ────────────────────────────────────────────────────────────
  test('TC-TRACK-001 — Valid tracking code → bot sends status reply', async ({ request }, testInfo) => {
    if (!VALID_CODE) test.skip(true, 'Set CE_VALID_TRACKING_CODE in .env');

    const update = textUpdate(VALID_CODE);
    await sendUpdate(request, update);

    const messages = await waitForReply(request);
    const reply = messages[0];

    // Bot must reply to the correct chat
    expect(reply.chatId).toBe(parseInt(process.env.TEST_CHAT_ID || '999999999'));

    // Reply must contain the tracking code so user knows which parcel it is
    expect(reply.text).toContain(VALID_CODE);

    // Reply must not be an error message
    expect(reply.text.toLowerCase()).not.toContain('error');
    expect(reply.text.toLowerCase()).not.toContain('failed');

    attachProof(testInfo, update, messages);
  });

  // ── TC-TRACK-002 ────────────────────────────────────────────────────────────
  test('TC-TRACK-002 — Invalid tracking code → bot replies with error message', async ({ request }, testInfo) => {
    const update = textUpdate(INVALID_CODE);
    await sendUpdate(request, update);

    const messages = await waitForReply(request);
    const reply = messages[0];

    // Must send a reply (not go silent)
    expect(reply).toBeDefined();
    expect(reply.text.length).toBeGreaterThan(0);

    // Reply should indicate a problem (not a valid tracking result)
    const text = reply.text.toLowerCase();
    const isErrorLike = text.includes('not found') ||
                        text.includes('invalid') ||
                        text.includes('error') ||
                        text.includes('unable') ||
                        text.includes('cannot') ||
                        text.includes('sorry');
    expect(isErrorLike).toBe(true);

    attachProof(testInfo, update, messages);
  });

  // ── TC-TRACK-005 ────────────────────────────────────────────────────────────
  test('TC-TRACK-005 — Same code within 5 min → rate limit reply', async ({ request }, testInfo) => {
    if (!VALID_CODE) test.skip(true, 'Set CE_VALID_TRACKING_CODE in .env');

    // First check
    await sendUpdate(request, textUpdate(VALID_CODE));
    await waitForReply(request, 1);

    // Clear captures so we only see the second reply
    await clearCaptured(request);

    // Second check immediately (within 5 min)
    const update2 = textUpdate(VALID_CODE);
    await sendUpdate(request, update2);
    const messages = await waitForReply(request, 1);

    const reply = messages[0];

    // Should be a rate limit message, not fresh tracking data
    const text = reply.text.toLowerCase();
    const isRateLimited = text.includes('wait') ||
                          text.includes('minute') ||
                          text.includes('try again') ||
                          text.includes('cooldown') ||
                          text.includes('too soon') ||
                          text.includes('recently');
    expect(isRateLimited).toBe(true);

    attachProof(testInfo, update2, messages);
  });

  // ── TC-TRACK-008 ────────────────────────────────────────────────────────────
  test('TC-TRACK-008 — 11th tracking code is rejected', async ({ request }, testInfo) => {
    // Add 10 codes (using fake codes since we just need the limit hit)
    for (let i = 1; i <= 10; i++) {
      await clearCaptured(request);
      await sendUpdate(request, textUpdate(`FAKETEST00${String(i).padStart(3, '0')}`));
      await waitForReply(request, 1);
    }

    await clearCaptured(request);

    // Try to add the 11th
    const update = textUpdate('FAKETEST0011');
    await sendUpdate(request, update);
    const messages = await waitForReply(request, 1);
    const reply = messages[0];

    // Must be rejected with a limit message
    const text = reply.text.toLowerCase();
    const isLimitMessage = text.includes('limit') ||
                           text.includes('maximum') ||
                           text.includes('max') ||
                           text.includes('too many');
    expect(isLimitMessage).toBe(true);

    attachProof(testInfo, update, messages);
  });

});
