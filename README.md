# Virtual Historical Armenia — Telegram Mini App

A mobile-first React Telegram Mini App for exploring Western and Eastern Armenia through a protected historical catalog, animated discovery map, searchable places and period-aware timelines.

## v0.2.0 — Step 2

This milestone turns the visual foundation into a functional discovery app:

- Searchable historical place catalog with Armenian and English names
- Western/Eastern region filters and place-type filters
- Dynamic place pages loaded from the protected API
- Animated map markers with selectable place sheets
- Period-aware timeline with linked places
- Telegram profile/security page and local favorites
- Source-first editorial notices and publication-status fields
- Vercel-compatible Telegram webhook for `/start`, `/app` and `/help`
- Input validation, short-lived sessions, CSRF, strict origins, rate limits and webhook-secret validation

The bundled place records are seed/demo content. Historical claims, images and boundaries must pass editorial and source review before public publication.

## Project structure

```text
apps/
├── web/   React + Vite + Framer Motion
├── api/   Express 5 secure API and catalog
└── bot/   Telegraf local-development bot
```

## Install and run locally

```bash
npm install
```

Copy the environment examples:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/bot/.env.example apps/bot/.env
cp apps/web/.env.example apps/web/.env
```

On PowerShell:

```powershell
Copy-Item apps\api\.env.example apps\api\.env
Copy-Item apps\bot\.env.example apps\bot\.env
Copy-Item apps\web\.env.example apps\web\.env
```

Generate secrets:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Use the first result for `SESSION_SECRET` and the second for `TELEGRAM_WEBHOOK_SECRET`.

```bash
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:8787
- Health: http://localhost:8787/api/health

`DEV_AUTH_BYPASS=true` is allowed only in local development. Production refuses to start when it is enabled.

## Vercel deployment

Deploy from the repository root. The root must contain `server.js`, `vercel.json`, `package.json` and `apps/`.

Required production variables:

```env
NODE_ENV=production
TRUST_PROXY=1
BOT_TOKEN=YOUR_BOTFATHER_TOKEN
SESSION_SECRET=YOUR_96_CHARACTER_SECRET
ALLOWED_ORIGINS=https://historical-armenia-web.vercel.app
DEV_AUTH_BYPASS=false
TELEGRAM_AUTH_MAX_AGE_SECONDS=600
SESSION_TTL_SECONDS=900
WEB_APP_URL=https://historical-armenia-web.vercel.app
TELEGRAM_WEBHOOK_SECRET=YOUR_RANDOM_WEBHOOK_SECRET
```

Optional frontend build variable:

```env
VITE_BOT_USERNAME=your_bot_username_without_at
```

See [`docs/VERCEL.md`](docs/VERCEL.md) for the exact dashboard settings.

## Enable the Telegram webhook

Put the production values in `apps/api/.env`, then run:

```bash
npm run telegram:set-webhook
```

The script registers:

```text
https://YOUR_DOMAIN/api/telegram/webhook
```

Telegram signs every request with `X-Telegram-Bot-Api-Secret-Token`, and the API compares it using a timing-safe check.

## Security boundary

- The bot token and session secret never enter the React bundle.
- Telegram raw `initData` is validated server-side before a session is issued.
- Protected content endpoints require a valid signed session.
- State-changing API calls require a matching CSRF token.
- Browser origins are allowlisted exactly.
- The webhook bypasses browser-origin checks only because it has its own Telegram secret-header authentication.
- Favorites in v0.2.0 are stored on the current device; cross-device synchronization will arrive with the database milestone.

## Next milestone

Step 3 will add PostgreSQL, an admin/editor role system, reviewed citations, upload metadata, draft/publish workflows and persistent user favorites.

## v0.2.1 Vercel asset fix

This release fixes `text/html` MIME mismatch errors for generated Vite CSS/JS assets.

- Missing `/assets/*` files now return a real 404 instead of the React HTML shell.
- `index.html` is served with `no-cache, no-store, must-revalidate`.
- Hashed `/assets/*` files use immutable one-year caching.
- The production build fails automatically when `index.html` references an asset that does not exist.

After deploying this release, redeploy without the old build cache and perform one hard refresh.
