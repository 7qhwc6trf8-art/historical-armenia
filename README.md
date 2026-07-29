# Virtual Historical Armenia — Telegram Mini App

A mobile-first React Telegram Mini App for exploring Western and Eastern Armenia through regions, settlements, monuments, maps, timelines, and cited historical material.

This v0.1.2 foundation includes:

- Premium dark/gold animated React interface
- Telegram Mini App bootstrap and theme integration
- Telegram `initData` validation on the API server
- Short-lived HTTP-only authentication cookie
- CSRF protection for state-changing routes
- Helmet security headers, strict CORS/origin checks, request limits, rate limiting, and input validation
- A Telegraf bot that launches the Mini App
- Responsive desktop preview for development

## Project structure

```text
apps/
├── web/   React + Vite + Framer Motion
├── api/   Express 5 secure API
└── bot/   Telegraf launcher bot
```

## 1. Install

```bash
npm install
```

## 2. Configure

Copy each example file:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/bot/.env.example apps/bot/.env
cp apps/web/.env.example apps/web/.env
```

Use the same Telegram bot token in `apps/api/.env` and `apps/bot/.env`.

Generate the API session secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## 3. Local development

For browser-only development, leave `DEV_AUTH_BYPASS=true` in the API environment. It is rejected automatically when `NODE_ENV=production`.

```bash
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:8787

Telegram requires an HTTPS Mini App URL. Use a trusted HTTPS tunnel during development, then set that URL in `apps/bot/.env` as `WEB_APP_URL`.

## 4. Run inside Telegram

1. Create a bot with BotFather.
2. Put its token in both API and bot environment files.
3. Set `WEB_APP_URL` to your HTTPS frontend URL.
4. Start the API, web app, and bot.
5. Open the bot and press **Open Historical Armenia**.

## Security boundary

- The bot token exists only on the API and bot processes.
- The frontend sends Telegram's raw `initData` to the API.
- The API validates the HMAC, timestamp, and user payload before creating a session.
- `initDataUnsafe` is used only for non-sensitive visual hints and is never trusted as authentication.
- Production must use HTTPS and a reverse proxy such as Nginx or Caddy.

## Next milestone

v0.2 will add PostgreSQL/Prisma, a real SVG/MapLibre historical map, multilingual content, an admin panel, citations, image storage, and audited content publishing.

## Windows / Node.js 24 note

Version 0.1.2 starts npm workspaces through Node's npm CLI instead of spawning `npm.cmd` directly. This removes the Windows `spawn EINVAL` failure and the root package now explicitly uses ES modules.

If one service needs to be started separately:

```powershell
npm run dev:web
npm run dev:api
npm run dev:bot
```

## Vercel deployment — v0.1.2

Version 0.1.2 adds a root Express entry point, builds React into the root `public` directory, serves React Router routes safely, and keeps `/api` on the same HTTPS origin. See [`docs/VERCEL.md`](docs/VERCEL.md) for the complete deployment steps.

Important: in Vercel, keep the project **Root Directory** at the repository root. Do not select `apps/web`, because that would deploy only the interface and omit Telegram authentication and the protected API.
