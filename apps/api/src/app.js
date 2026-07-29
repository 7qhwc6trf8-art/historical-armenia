import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import { ZodError } from 'zod';
import { config } from './config.js';
import { requireTrustedOrigin } from './middleware/origin.js';
import authRouter from './routes/auth.js';
import contentRouter from './routes/content.js';
import telegramWebhookRouter from './routes/telegramWebhook.js';
import { requireCsrf, requireSession } from './security/session.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', config.TRUST_PROXY);

  app.use('/api', helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: 'same-site' },
  }));
  app.use(compression());
  app.use(cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || config.allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origin is not allowed by CORS.'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
  }));
  app.use(express.json({ limit: '16kb', strict: true }));
  app.use(cookieParser());
  app.use(hpp());

  // Telegram does not send a browser Origin header. Its webhook is authenticated
  // with X-Telegram-Bot-Api-Secret-Token and is mounted before origin checks.
  app.use('/api/telegram', rateLimit({
    windowMs: 60_000,
    limit: 90,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  }), telegramWebhookRouter);

  app.use(requireTrustedOrigin);

  app.use('/api', rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'RATE_LIMITED', message: 'Too many requests. Please try again shortly.' },
  }));
  app.use('/api/auth', rateLimit({
    windowMs: 60_000,
    limit: 15,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'AUTH_RATE_LIMITED', message: 'Too many sign-in attempts.' },
  }));

  app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'vha-api', version: '0.2.1', telegramWebhook: config.telegramWebhookEnabled }));
  app.use('/api/auth', authRouter);
  app.use('/api/content', requireSession, contentRouter);

  app.get('/api/me', requireSession, (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json({
      user: {
        id: Number(req.user.sub),
        firstName: req.user.firstName,
        username: req.user.username,
        languageCode: req.user.languageCode,
        role: req.user.role,
      },
    });
  });

  app.post('/api/favorites/:placeId', requireSession, requireCsrf, (req, res) => {
    const placeId = String(req.params.placeId || '').replace(/[^a-z0-9-]/gi, '').slice(0, 80);
    if (!placeId) return res.status(400).json({ error: 'INVALID_PLACE', message: 'Place ID is invalid.' });
    return res.json({ ok: true, placeId, favorite: true });
  });

  app.use('/api', (_req, res) => res.status(404).json({ error: 'NOT_FOUND', message: 'Route not found.' }));

  app.use((error, _req, res, _next) => {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Request data is invalid.' });
    }
    if (error?.message === 'Origin is not allowed by CORS.') {
      return res.status(403).json({ error: 'CORS_DENIED', message: 'Origin is not allowed.' });
    }
    console.error(config.isProduction ? error?.message : error);
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'The server could not process the request.' });
  });

  return app;
}
