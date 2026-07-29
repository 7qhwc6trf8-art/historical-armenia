import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createApp } from './apps/api/src/app.js';
import { config } from './apps/api/src/config.js';

const app = createApp();
const publicDirectory = fileURLToPath(new URL('./public/', import.meta.url));
const indexFile = path.join(publicDirectory, 'index.html');

app.use(express.static(publicDirectory, {
  index: false,
  etag: true,
  maxAge: config.isProduction ? '1h' : 0,
  setHeaders(res, filePath) {
    if (/\.[a-f0-9]{8,}\.(?:js|css|svg|png|jpe?g|webp|woff2?)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  },
}));

// React Router fallback. API requests are intentionally excluded.
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path === '/api' || req.path.startsWith('/api/')) {
    return next();
  }

  return res.sendFile(indexFile, (error) => {
    if (error) next(error);
  });
});

export default app;

// Vercel imports the Express application. A normal listener is used elsewhere.
if (process.env.VERCEL !== '1') {
  app.listen(config.PORT, '0.0.0.0', () => {
    console.log(`VHA production server listening on http://0.0.0.0:${config.PORT}`);
  });
}
