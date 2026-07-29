# Deploy Virtual Historical Armenia to Vercel

Version 0.1.2 deploys the React frontend and protected Express API as one Vercel project and one HTTPS origin. This is important because the authentication cookie is host-only and SameSite=Strict.

## 1. Push to GitHub

Never commit any `.env` file.

```powershell
git init
git add .
git commit -m "Prepare VHA for Vercel"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/virtual-historical-armenia.git
git push -u origin main
```

## 2. Create the Vercel project

- Import the GitHub repository.
- Keep **Root Directory** at the repository root.
- The included `vercel.json` selects the Express framework and runs the React build.
- Do not set the root directory to `apps/web`, because that would omit the protected API.

## 3. Add production environment variables

Add these for Production in Vercel Project Settings → Environment Variables:

```env
NODE_ENV=production
TRUST_PROXY=1
BOT_TOKEN=YOUR_BOTFATHER_TOKEN
SESSION_SECRET=PASTE_A_RANDOM_48_BYTE_HEX_SECRET
ALLOWED_ORIGINS=https://YOUR_PROJECT.vercel.app
DEV_AUTH_BYPASS=false
TELEGRAM_AUTH_MAX_AGE_SECONDS=600
SESSION_TTL_SECONDS=900
```

Generate `SESSION_SECRET` locally:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

After changing environment variables, redeploy.

## 4. Verify the deployment

Open:

```text
https://YOUR_PROJECT.vercel.app/api/health
```

Expected result:

```json
{"ok":true,"service":"vha-api","version":"0.1.2"}
```

Opening the site in a normal browser should show `Secure sign-in failed`. That is expected in production because browser development bypass is disabled. Open it from Telegram to authenticate.

## 5. Connect Telegram

Set the deployed HTTPS URL as the Mini App URL in BotFather. Also use the same URL for `WEB_APP_URL` when running the optional Telegraf launcher bot.

The current launcher in `apps/bot` uses long polling and must run on a persistent Node.js host. Vercel should use a Telegram webhook instead; that conversion is planned for the next milestone. The Mini App itself can still be opened through BotFather's configured Main Mini App/menu button without a continuously running launcher process.
