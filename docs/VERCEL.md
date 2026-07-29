# Vercel deployment

## Project settings

Import the repository and keep the project root at the repository root.

```text
Framework Preset: Express
Root Directory: ./
Install Command: npm install
Build Command: npm run build
Output Directory: empty
Node.js Version: 22.x
```

Do not select `apps/web`; that would omit the Express API and Telegram authentication.

## Production variables

Add every variable as its own Vercel row:

```env
NODE_ENV=production
TRUST_PROXY=1
BOT_TOKEN=YOUR_BOTFATHER_TOKEN
SESSION_SECRET=YOUR_96_CHARACTER_RANDOM_SECRET
ALLOWED_ORIGINS=https://historical-armenia-web.vercel.app
DEV_AUTH_BYPASS=false
TELEGRAM_AUTH_MAX_AGE_SECONDS=600
SESSION_TTL_SECONDS=900
WEB_APP_URL=https://historical-armenia-web.vercel.app
TELEGRAM_WEBHOOK_SECRET=YOUR_RANDOM_WEBHOOK_SECRET
VITE_BOT_USERNAME=your_bot_username_without_at
```

`ALLOWED_ORIGINS` and `WEB_APP_URL` must use the exact deployed HTTPS origin without a trailing slash.

After changing variables, create a new deployment. Existing deployments do not receive newly added values.

## Verify

Open:

```text
https://YOUR_DOMAIN/api/health
```

Expected shape:

```json
{
  "ok": true,
  "service": "vha-api",
  "version": "0.2.0",
  "telegramWebhook": true
}
```

The root page should load bundled files under `/assets/`; it must not request `/src/main.jsx` in production.

## Register the bot webhook

Copy the production variables into `apps/api/.env`, then run locally:

```bash
npm run telegram:set-webhook
```

After Telegram confirms the webhook, `/start`, `/app` and `/help` can run through the Vercel function. Do not run the long-polling Telegraf process at the same time as the webhook.

## Asset MIME verification

After `npm run build`, run `npm run verify:vercel-static`. It starts the exported app in Vercel mode and confirms that a hashed Vite asset returns a JavaScript or CSS content type instead of `text/plain`/`text/html`.
