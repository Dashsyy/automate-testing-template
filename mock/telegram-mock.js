/**
 * Mock Telegram API Server
 *
 * Replaces api.telegram.org in staging so the bot calls this server
 * instead of real Telegram. Every message the bot tries to send gets
 * captured here — tests then read those captures as proof.
 *
 * How to use:
 *   1. npm run mock          → starts this server on port 4444
 *   2. Set the bot's TELEGRAM_API_URL=http://localhost:4444 in staging
 *   3. npm run test:bot      → runs tests, each test reads /captured as proof
 *
 * Endpoints the bot calls (all intercepted):
 *   POST /bot:token/sendMessage
 *   POST /bot:token/answerCallbackQuery
 *   POST /bot:token/setWebhook
 *   POST /bot:token/deleteWebhook
 *
 * Endpoints tests use:
 *   GET  /captured           → get all captured bot replies so far
 *   DELETE /captured         → clear captures (run before each test)
 *   GET  /health             → confirm mock is running
 */

import express from 'express';

const app = express();
app.use(express.json());

let captured = [];

// ── Bot API endpoints ─────────────────────────────────────────────────────────

app.post('/bot:token/sendMessage', (req, res) => {
  const entry = {
    type: 'sendMessage',
    chatId: req.body.chat_id,
    text: req.body.text || '',
    parseMode: req.body.parse_mode || null,
    replyMarkup: req.body.reply_markup || null,
    capturedAt: new Date().toISOString(),
  };
  captured.push(entry);
  console.log(`[mock] sendMessage → chat ${entry.chatId}: "${entry.text.slice(0, 80)}"`);

  res.json({
    ok: true,
    result: {
      message_id: Math.floor(Math.random() * 100000),
      chat: { id: req.body.chat_id, type: 'private' },
      text: req.body.text,
      date: Math.floor(Date.now() / 1000),
    },
  });
});

app.post('/bot:token/editMessageText', (req, res) => {
  const entry = {
    type: 'editMessageText',
    chatId: req.body.chat_id,
    text: req.body.text || '',
    replyMarkup: req.body.reply_markup || null,
    capturedAt: new Date().toISOString(),
  };
  captured.push(entry);
  console.log(`[mock] editMessageText → chat ${entry.chatId}: "${entry.text.slice(0, 80)}"`);
  res.json({ ok: true, result: true });
});

app.post('/bot:token/answerCallbackQuery', (req, res) => {
  const entry = {
    type: 'answerCallbackQuery',
    callbackQueryId: req.body.callback_query_id,
    text: req.body.text || '',
    capturedAt: new Date().toISOString(),
  };
  captured.push(entry);
  res.json({ ok: true, result: true });
});

app.post('/bot:token/setWebhook', (req, res) => {
  console.log(`[mock] setWebhook → ${req.body.url}`);
  res.json({ ok: true, result: true, description: 'Webhook was set' });
});

app.post('/bot:token/deleteWebhook', (req, res) => {
  res.json({ ok: true, result: true });
});

app.get('/bot:token/getMe', (req, res) => {
  res.json({
    ok: true,
    result: { id: 1234567890, is_bot: true, first_name: 'CE Tracker', username: 'ce_tracker_bot' },
  });
});

// Catch-all for any other bot API calls — log them so we know what's missing
app.all('/bot:token/*', (req, res) => {
  console.log(`[mock] unhandled: ${req.method} ${req.path}`, req.body);
  res.json({ ok: true, result: true });
});

// ── Test helper endpoints ─────────────────────────────────────────────────────

// Get all captured messages (proof)
app.get('/captured', (req, res) => {
  res.json(captured);
});

// Clear captures before each test
app.delete('/captured', (req, res) => {
  captured = [];
  res.json({ ok: true, cleared: true });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, captured: captured.length });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.MOCK_PORT || 4444;
app.listen(PORT, () => {
  console.log(`\n  Telegram Mock API  →  http://localhost:${PORT}`);
  console.log(`  Set bot env var:     TELEGRAM_API_URL=http://localhost:${PORT}\n`);
});
