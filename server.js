import express from 'express';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createApp } from './apps/api/src/app.js';
import { config } from './apps/api/src/config.js';

const app = createApp();
const isVercel = process.env.VERCEL === '1';
const publicDirectory = fileURLToPath(new URL('./public/', import.meta.url));
const indexFile = path.join(publicDirectory, 'index.html');

// Vercel serves public/** from its CDN. Keep Express static only for local/self-hosted
// production, where there is no Vercel static layer.
if (!isVercel) {
  app.use(express.static(publicDirectory, {
    index: false,
    etag: true,
    maxAge: config.isProduction ? '1h' : 0,
    setHeaders(res, filePath) {
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  }));
}

// React Router fallback. Never return index.html for a missing CSS/JS/image file:
// doing that produces the browser's "text/html MIME type mismatch" error.
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path === '/api' || req.path.startsWith('/api/')) {
    return next();
  }

  const hasFileExtension = path.posix.extname(req.path) !== '';
  const isAssetRequest = req.path === '/assets' || req.path.startsWith('/assets/');

  if (hasFileExtension || isAssetRequest) {
    return res.status(404).type('text/plain').send('Static asset not found.');
  }

  if (!existsSync(indexFile)) {
    return res.status(503).json({
      error: 'FRONTEND_BUILD_MISSING',
      message: 'The frontend build is unavailable. Run npm run build before deployment.',
    });
  }

  // Vite HTML must be revalidated so it never references hashed assets from an
  // older deployment. Hashed files under /assets are cached immutably instead.
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.type('html');

  return res.sendFile(indexFile, (error) => {
    if (error) next(error);
  });
});

export default app;

if (!isVercel) {
  app.listen(config.PORT, '0.0.0.0', () => {
    console.log(`VHA production server listening on http://0.0.0.0:${config.PORT}`);
  });
}
