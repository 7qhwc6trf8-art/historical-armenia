import { readFileSync } from 'node:fs';
import path from 'node:path';

process.env.VERCEL = '1';
process.env.NODE_ENV = 'production';
process.env.BOT_TOKEN ||= '1234567890:TEST_TOKEN_FOR_LOCAL_STATIC_VERIFY';
process.env.SESSION_SECRET ||= 'a'.repeat(96);
process.env.ALLOWED_ORIGINS ||= 'https://example.vercel.app';
process.env.WEB_APP_URL ||= 'https://example.vercel.app';
process.env.TELEGRAM_WEBHOOK_SECRET ||= 'b'.repeat(43);

const html = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const assetMatch = html.match(/(?:src|href)=["'](\/assets\/[^"'#?]+)/);
if (!assetMatch) throw new Error('No built asset reference found in public/index.html.');

const { default: app } = await import('../server.js');
const server = app.listen(0, '127.0.0.1');
await new Promise((resolve, reject) => {
  server.once('listening', resolve);
  server.once('error', reject);
});

try {
  const address = server.address();
  const base = `http://127.0.0.1:${address.port}`;
  const assetUrl = new URL(assetMatch[1], base);
  const response = await fetch(assetUrl);
  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) throw new Error(`Asset returned HTTP ${response.status}: ${assetMatch[1]}`);
  if (!/(javascript|css)/i.test(contentType)) {
    throw new Error(`Unexpected asset Content-Type ${JSON.stringify(contentType)} for ${assetMatch[1]}`);
  }

  const body = await response.text();
  if (!body.trim()) throw new Error(`Asset body is empty: ${assetMatch[1]}`);

  console.log(`Vercel static verification passed: ${assetMatch[1]} -> ${contentType}`);
} finally {
  await new Promise((resolve) => server.close(resolve));
}
