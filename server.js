import express from 'express';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createApp } from './apps/api/src/app.js';
import { config } from './apps/api/src/config.js';

const app = createApp();
const isVercel = process.env.VERCEL === '1';
const publicDirectory = fileURLToPath(new URL('./public/', import.meta.url));
const publicRootWithSeparator = `${path.resolve(publicDirectory)}${path.sep}`;
const indexFile = path.join(publicDirectory, 'index.html');

function resolvePublicFile(requestPath) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(requestPath);
  } catch {
    return null;
  }

  // Remove the leading slash and normalize Windows/POSIX separators. Resolving
  // against publicDirectory plus the prefix check blocks ../ traversal.
  const relativePath = decodedPath.replace(/^\/+/, '').replaceAll('\\', '/');
  if (!relativePath || relativePath.includes('\0')) return null;

  const candidate = path.resolve(publicDirectory, relativePath);
  if (candidate !== path.resolve(publicDirectory) && !candidate.startsWith(publicRootWithSeparator)) {
    return null;
  }

  if (!existsSync(candidate) || !statSync(candidate).isFile()) return null;
  return candidate;
}

// Vercel's Express adapter ignores express.static(). The frontend build is
// included in the function bundle through vercel.json, so serve existing files
// explicitly with sendFile(). This guarantees correct MIME types for Vite's
// hashed JS/CSS assets instead of letting them fall through to the SPA handler.
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  if (req.path === '/api' || req.path.startsWith('/api/')) return next();

  const filePath = resolvePublicFile(req.path);
  if (!filePath) return next();

  if (filePath.includes(`${path.sep}assets${path.sep}`)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (path.basename(filePath) === 'index.html') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }

  return res.sendFile(filePath, (error) => {
    if (error) next(error);
  });
});

// React Router fallback. Missing files must never return index.html because
// browsers would reject HTML/plain-text responses as JavaScript or CSS.
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
