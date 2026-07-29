import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';
import { TelegramAuthError, validateTelegramInitData } from '../src/security/telegram.js';

const token = '123456789:TEST_BOT_TOKEN_FOR_UNIT_TESTS';
const now = 1_800_000_000;

function sign(params) {
  const search = new URLSearchParams(params);
  const dataCheckString = [...search.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  const secretKey = createHmac('sha256', 'WebAppData').update(token).digest();
  const hash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  search.set('hash', hash);
  return search.toString();
}

test('accepts correctly signed fresh Telegram initData', () => {
  const initData = sign({
    auth_date: String(now - 10),
    query_id: 'AAEAAAE',
    user: JSON.stringify({ id: 42, first_name: 'Erik', username: 'example' }),
  });
  const result = validateTelegramInitData(initData, token, { nowSeconds: now, maxAgeSeconds: 600 });
  assert.equal(result.user.id, 42);
  assert.equal(result.user.firstName, 'Erik');
});

test('rejects modified initData', () => {
  const initData = sign({ auth_date: String(now - 10), user: JSON.stringify({ id: 42, first_name: 'Erik' }) });
  const modified = initData.replace('Erik', 'Other');
  assert.throws(
    () => validateTelegramInitData(modified, token, { nowSeconds: now, maxAgeSeconds: 600 }),
    (error) => error instanceof TelegramAuthError && error.code === 'INVALID_SIGNATURE',
  );
});

test('rejects expired initData', () => {
  const initData = sign({ auth_date: String(now - 1000), user: JSON.stringify({ id: 42, first_name: 'Erik' }) });
  assert.throws(
    () => validateTelegramInitData(initData, token, { nowSeconds: now, maxAgeSeconds: 600 }),
    (error) => error instanceof TelegramAuthError && error.code === 'EXPIRED_INIT_DATA',
  );
});
