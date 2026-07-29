import 'dotenv/config';
import { z } from 'zod';

const booleanString = z.enum(['true', 'false']).transform((value) => value === 'true');

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(8787),
  TRUST_PROXY: z.coerce.number().int().min(0).max(3).default(0),
  BOT_TOKEN: z.string().min(10),
  SESSION_SECRET: z.string().min(48),
  ALLOWED_ORIGINS: z.string().min(1),
  DEV_AUTH_BYPASS: booleanString.default('false'),
  TELEGRAM_AUTH_MAX_AGE_SECONDS: z.coerce.number().int().min(30).max(3600).default(600),
  SESSION_TTL_SECONDS: z.coerce.number().int().min(300).max(86400).default(900),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid API environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

if (parsed.data.NODE_ENV === 'production' && parsed.data.DEV_AUTH_BYPASS) {
  console.error('DEV_AUTH_BYPASS cannot be enabled in production.');
  process.exit(1);
}

export const config = {
  ...parsed.data,
  isProduction: parsed.data.NODE_ENV === 'production',
  allowedOrigins: parsed.data.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean),
};
