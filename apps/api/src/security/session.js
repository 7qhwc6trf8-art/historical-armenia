import { randomBytes, timingSafeEqual } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const SESSION_COOKIE = config.isProduction ? '__Host-vha_session' : 'vha_session';
export const CSRF_COOKIE = config.isProduction ? '__Host-vha_csrf' : 'vha_csrf';

function cookieOptions(httpOnly) {
  return {
    httpOnly,
    secure: config.isProduction,
    sameSite: 'strict',
    path: '/',
    maxAge: config.SESSION_TTL_SECONDS * 1000,
  };
}

export function issueSession(res, user) {
  const token = jwt.sign(
    {
      sub: String(user.id),
      firstName: user.firstName,
      username: user.username,
      languageCode: user.languageCode,
      role: 'user',
    },
    config.SESSION_SECRET,
    {
      algorithm: 'HS256',
      audience: 'vha-mini-app',
      issuer: 'vha-api',
      expiresIn: config.SESSION_TTL_SECONDS,
    },
  );

  const csrfToken = randomBytes(32).toString('base64url');
  res.cookie(SESSION_COOKIE, token, cookieOptions(true));
  res.cookie(CSRF_COOKIE, csrfToken, cookieOptions(false));
  return csrfToken;
}

export function clearSession(res) {
  const sessionOptions = cookieOptions(true);
  const csrfOptions = cookieOptions(false);
  delete sessionOptions.maxAge;
  delete csrfOptions.maxAge;
  res.clearCookie(SESSION_COOKIE, sessionOptions);
  res.clearCookie(CSRF_COOKIE, csrfOptions);
}

export function requireSession(req, res, next) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return res.status(401).json({ error: 'UNAUTHENTICATED', message: 'Authentication is required.' });

  try {
    req.user = jwt.verify(token, config.SESSION_SECRET, {
      algorithms: ['HS256'],
      audience: 'vha-mini-app',
      issuer: 'vha-api',
    });
    return next();
  } catch {
    clearSession(res);
    return res.status(401).json({ error: 'INVALID_SESSION', message: 'Your session is invalid or expired.' });
  }
}

export function requireCsrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const cookie = req.cookies?.[CSRF_COOKIE];
  const header = req.get('X-CSRF-Token');

  if (!cookie || !header) {
    return res.status(403).json({ error: 'CSRF_REQUIRED', message: 'CSRF validation failed.' });
  }

  const left = Buffer.from(cookie);
  const right = Buffer.from(header);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return res.status(403).json({ error: 'CSRF_INVALID', message: 'CSRF validation failed.' });
  }

  return next();
}
