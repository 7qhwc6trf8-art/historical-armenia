const STORAGE_KEY = 'vha:favorites:v1';
const EVENT_NAME = 'vha:favorites-changed';

function read() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value.filter((item) => typeof item === 'string').slice(0, 100) : [];
  } catch {
    return [];
  }
}

export function getFavorites() {
  return read();
}

export function isFavorite(slug) {
  return read().includes(slug);
}

export function toggleLocalFavorite(slug) {
  const favorites = new Set(read());
  if (favorites.has(slug)) favorites.delete(slug);
  else favorites.add(slug);
  const next = [...favorites].slice(0, 100);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* storage can be unavailable in restricted webviews */ }
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: next }));
  return next.includes(slug);
}

export function subscribeFavorites(listener) {
  const handler = (event) => listener(event.detail || read());
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
