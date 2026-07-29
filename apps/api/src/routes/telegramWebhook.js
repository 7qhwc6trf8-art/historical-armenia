import { timingSafeEqual } from 'node:crypto';
import { Router } from 'express';
import { config } from '../config.js';

const router = Router();

function secureEqual(left, right) {
  const a = Buffer.from(String(left || ''));
  const b = Buffer.from(String(right || ''));
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
}

async function telegram(method, payload) {
  const response = await fetch(`https://api.telegram.org/bot${config.BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8_000),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.ok) {
    throw new Error(`Telegram API ${method} failed with status ${response.status}.`);
  }
  return result.result;
}

function miniAppKeyboard() {
  return {
    inline_keyboard: [[
      { text: '🏛 Open Historical Armenia', web_app: { url: config.WEB_APP_URL } },
    ]],
  };
}

router.post('/webhook', async (req, res) => {
  if (!config.telegramWebhookEnabled) {
    return res.status(503).json({ error: 'WEBHOOK_DISABLED', message: 'Telegram webhook variables are not configured.' });
  }

  const secret = req.get('X-Telegram-Bot-Api-Secret-Token');
  if (!secureEqual(secret, config.TELEGRAM_WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'INVALID_WEBHOOK_SECRET', message: 'Webhook secret is invalid.' });
  }

  const message = req.body?.message;
  if (!message?.chat?.id || typeof message.text !== 'string') return res.json({ ok: true });

  const command = message.text.trim().split(/\s+/)[0].toLowerCase().split('@')[0];
  try {
    if (command === '/start') {
      await telegram('sendMessage', {
        chat_id: message.chat.id,
        parse_mode: 'HTML',
        text: [
          '🏛 <b>Virtual Historical Armenia</b>',
          '',
          'Explore Western and Eastern Armenia through an animated historical atlas, searchable places and period-aware timelines.',
          '',
          'Open the secure Telegram Mini App below.',
        ].join('\n'),
        reply_markup: miniAppKeyboard(),
      });
    } else if (command === '/app') {
      await telegram('sendMessage', {
        chat_id: message.chat.id,
        text: 'Open the historical atlas:',
        reply_markup: miniAppKeyboard(),
      });
    } else if (command === '/help') {
      await telegram('sendMessage', {
        chat_id: message.chat.id,
        text: 'Use /app to open the atlas. Search, map and timeline tools are available inside the Mini App.',
        reply_markup: miniAppKeyboard(),
      });
    }
  } catch (error) {
    console.error(config.isProduction ? error.message : error);
  }

  return res.json({ ok: true });
});

export default router;
