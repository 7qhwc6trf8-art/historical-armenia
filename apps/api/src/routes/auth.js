import { Router } from 'express';
import { z } from 'zod';
import { config } from '../config.js';
import { TelegramAuthError, validateTelegramInitData } from '../security/telegram.js';
import { clearSession, issueSession, requireCsrf, requireSession } from '../security/session.js';

const router = Router();
const bodySchema = z.object({ initData: z.string().max(8192) });

router.post('/telegram', (req, res, next) => {
  try {
    const { initData } = bodySchema.parse(req.body);
    let user;

    if (!initData && config.DEV_AUTH_BYPASS && !config.isProduction) {
      user = {
        id: 999000111,
        firstName: 'Developer',
        lastName: '',
        username: 'local_preview',
        languageCode: 'en',
        isPremium: false,
      };
    } else {
      user = validateTelegramInitData(initData, config.BOT_TOKEN, {
        maxAgeSeconds: config.TELEGRAM_AUTH_MAX_AGE_SECONDS,
      }).user;
    }

    const csrfToken = issueSession(res, user);
    return res.json({ ok: true, csrfToken, user });
  } catch (error) {
    if (error instanceof TelegramAuthError) {
      return res.status(401).json({ error: error.code, message: error.message });
    }
    return next(error);
  }
});

router.post('/logout', requireSession, requireCsrf, (_req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

export default router;
