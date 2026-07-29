# Virtual Historical Armenia — Telegram Mini App

## v0.3.1 — Dynamic iOS navbar and tab-bar fix

This release replaces the old web-style shell with a native-feeling Telegram Mini App foundation:

- Apple system font stack (`-apple-system` / SF Pro on iOS) with no external font download
- Telegram full-screen request with expanded-mode fallback
- Telegram native `BackButton` for pushed detail screens
- Safe-area and content-safe-area support for notches and Telegram full-screen controls
- Compact centered iOS navigation bar without the previous oversized page title
- Floating frosted iOS-style tab bar with Framer Motion shared `layoutId` animations
- Direction-aware page transitions and reduced-motion support
- Vertical-swipe protection inside supported Telegram clients
- Tailwind CSS v4 Vite integration for the new component system
- Full-height internal scroll container with smooth mobile overscroll behavior

The historical map itself is intentionally unchanged in this step. UI rebuild Step 2 will replace it with the approved detailed map and draggable information sheet shown in `docs/ios-ui-reference.png`.


## Vercel static asset fix (v0.2.2)

Vercel ignores `express.static()` for Express deployments. This release explicitly serves files bundled from `public/**` with `res.sendFile()`, preserving correct JavaScript/CSS MIME types and immutable caching for hashed Vite assets.

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

UI rebuild Step 2 will implement the approved Western/Eastern map screen: detailed map artwork, animated markers, segmented region control and a draggable iOS information sheet. The database/editor milestone remains planned after the UI rebuild.

## v0.2.2 Vercel asset fix

This release fixes `text/html` MIME mismatch errors for generated Vite CSS/JS assets.

- Missing `/assets/*` files now return a real 404 instead of the React HTML shell.
- `index.html` is served with `no-cache, no-store, must-revalidate`.
- Hashed `/assets/*` files use immutable one-year caching.
- The production build fails automatically when `index.html` references an asset that does not exist.

After deploying this release, redeploy without the old build cache and perform one hard refresh.

## v0.3.1 — iOS Telegram Mini App UI

This release keeps the existing monorepo structure and all previous API, bot, security and Vercel work. The redesign is implemented inside `apps/web`.

### UI changes

- Apple system font stack (`-apple-system`, `BlinkMacSystemFont`, SF Pro when available)
- Full-height Telegram Mini App shell with safe-area support
- Telegram `requestFullscreen()` with expanded-mode fallback
- Native Telegram `BackButton` for nested routes
- Compact iOS-style centered navbar; duplicated page headers removed
- Floating iOS tab bar with Framer Motion `layoutId` transitions
- Direction-aware route push/pop transitions with `AnimatePresence`
- Animated Western/Eastern segmented control and active map marker
- Reduced-motion support and GPU-friendly transform/opacity animations
- Tailwind CSS v4 Vite plugin available inside the existing React workspace

### Upgrade without changing your folder structure

Copy the files from this release over the previous project while preserving your local `.env` files and `.git` folder. Then run:

```powershell
npm install
npm run dev
```

For Vercel:

```powershell
git add -A
git commit -m "Upgrade Telegram Mini App to iOS UI v0.3.1"
git push
```

The Vercel root directory remains the repository root and the output directory remains empty.
