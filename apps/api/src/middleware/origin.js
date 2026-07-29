import { config } from '../config.js';

export function requireTrustedOrigin(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.get('Origin');

  if (!origin || !config.allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'UNTRUSTED_ORIGIN', message: 'Request origin is not allowed.' });
  }

  return next();
}
