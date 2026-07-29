import { createHmac, timingSafeEqual } from 'node:crypto';

export class TelegramAuthError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'TelegramAuthError';
    this.code = code;
  }
}

function safeHexEqual(left, right) {
  if (!/^[a-f0-9]{64}$/i.test(left) || !/^[a-f0-9]{64}$/i.test(right)) return false;
  return timingSafeEqual(Buffer.from(left, 'hex'), Buffer.from(right, 'hex'));
}

export function validateTelegramInitData(initData, botToken, options = {}) {
  const maxAgeSeconds = options.maxAgeSeconds ?? 600;
  const nowSeconds = options.nowSeconds ?? Math.floor(Date.now() / 1000);

  if (typeof initData !== 'string' || initData.length < 10 || initData.length > 8192) {
    throw new TelegramAuthError('INVALID_INIT_DATA', 'Telegram initData is missing or malformed.');
  }

  const params = new URLSearchParams(initData);
  const receivedHash = params.get('hash') || '';
  params.delete('hash');

  const authDate = Number(params.get('auth_date'));
  if (!Number.isInteger(authDate)) {
    throw new TelegramAuthError('INVALID_AUTH_DATE', 'Telegram auth_date is invalid.');
  }

  const age = nowSeconds - authDate;
  if (age < -30 || age > maxAgeSeconds) {
    throw new TelegramAuthError('EXPIRED_INIT_DATA', 'Telegram authorization data has expired.');
  }

  const dataCheckString = [...params.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const calculatedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  if (!safeHexEqual(receivedHash, calculatedHash)) {
    throw new TelegramAuthError('INVALID_SIGNATURE', 'Telegram authorization signature is invalid.');
  }

  let user;
  try {
    user = JSON.parse(params.get('user') || 'null');
  } catch {
    throw new TelegramAuthError('INVALID_USER', 'Telegram user payload is invalid.');
  }

  if (!user || !Number.isSafeInteger(user.id) || user.id <= 0) {
    throw new TelegramAuthError('INVALID_USER', 'Telegram user identity is missing.');
  }

  return {
    authDate,
    queryId: params.get('query_id') || null,
    user: {
      id: user.id,
      firstName: String(user.first_name || '').slice(0, 64),
      lastName: String(user.last_name || '').slice(0, 64),
      username: user.username ? String(user.username).slice(0, 64) : null,
      languageCode: user.language_code ? String(user.language_code).slice(0, 16) : null,
      isPremium: Boolean(user.is_premium),
    },
  };
}
