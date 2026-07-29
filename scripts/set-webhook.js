import { z } from 'zod';

const env = z.object({
  BOT_TOKEN: z.string().min(10),
  WEB_APP_URL: z.string().url().refine((url) => url.startsWith('https://'), 'WEB_APP_URL must use HTTPS'),
  TELEGRAM_WEBHOOK_SECRET: z.string().min(16).max(256),
}).parse(process.env);

const webhookUrl = `${env.WEB_APP_URL.replace(/\/$/, '')}/api/telegram/webhook`;
const response = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/setWebhook`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: webhookUrl,
    secret_token: env.TELEGRAM_WEBHOOK_SECRET,
    allowed_updates: ['message'],
    drop_pending_updates: true,
  }),
});

const result = await response.json();
if (!response.ok || !result.ok) {
  console.error(result);
  process.exit(1);
}

console.log(`Telegram webhook configured: ${webhookUrl}`);
