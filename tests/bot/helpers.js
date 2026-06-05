/**
 * Shared helpers for bot tests.
 * Builds fake Telegram update payloads and reads captured mock replies.
 */

import 'dotenv/config';

export const BOT_WEBHOOK = process.env.BOT_WEBHOOK_URL;
export const MOCK_API    = `http://localhost:${process.env.MOCK_PORT || 4444}`;
export const TEST_CHAT_ID = parseInt(process.env.TEST_CHAT_ID || '999999999', 10);

let _updateId = 1;

// ── Fake Telegram update builders ─────────────────────────────────────────────

export function textUpdate(text) {
  return {
    update_id: _updateId++,
    message: {
      message_id: _updateId,
      chat: { id: TEST_CHAT_ID, type: 'private' },
      from: { id: TEST_CHAT_ID, is_bot: false, first_name: 'QA', username: 'qa_tester' },
      date: Math.floor(Date.now() / 1000),
      text,
    },
  };
}

export function callbackUpdate(data, messageId = 1) {
  return {
    update_id: _updateId++,
    callback_query: {
      id: String(_updateId),
      from: { id: TEST_CHAT_ID, is_bot: false, first_name: 'QA', username: 'qa_tester' },
      message: {
        message_id: messageId,
        chat: { id: TEST_CHAT_ID, type: 'private' },
        date: Math.floor(Date.now() / 1000),
        text: '',
      },
      data,
    },
  };
}

// ── Mock API helpers ──────────────────────────────────────────────────────────

/**
 * Send a fake Telegram update to the bot webhook.
 * Returns the HTTP response from the bot.
 */
export async function sendUpdate(request, update) {
  return request.post(BOT_WEBHOOK, { data: update });
}

/**
 * Get all messages the bot sent to the mock Telegram API.
 * These are the "proof" — what the bot actually replied.
 */
export async function getCaptured(request) {
  const res = await request.get(`${MOCK_API}/captured`);
  return res.json();
}

/**
 * Get only sendMessage captures (filter out answerCallbackQuery etc.)
 */
export async function getCapturedMessages(request) {
  const all = await getCaptured(request);
  return all.filter(c => c.type === 'sendMessage' || c.type === 'editMessageText');
}

/**
 * Clear all captures. Call in beforeEach.
 */
export async function clearCaptured(request) {
  await request.delete(`${MOCK_API}/captured`);
}

/**
 * Wait for the bot to process an update and call the mock.
 * Polls until at least `minCount` messages are captured or timeout.
 */
export async function waitForReply(request, minCount = 1, timeoutMs = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const messages = await getCapturedMessages(request);
    if (messages.length >= minCount) return messages;
    await new Promise(r => setTimeout(r, 200));
  }
  throw new Error(`Timed out waiting for ${minCount} bot reply(s) after ${timeoutMs}ms`);
}

/**
 * Attach captured proof to the Playwright test report.
 * Call this at the end of each test so the HTML report shows the conversation.
 */
export function attachProof(testInfo, input, captured) {
  const proof = {
    input,
    botReplies: captured,
    testedAt: new Date().toISOString(),
  };
  testInfo.attach('conversation-proof', {
    contentType: 'application/json',
    body: Buffer.from(JSON.stringify(proof, null, 2)),
  });
}
