const API_BASE = import.meta.env.VITE_API_BASE || '/api';
let csrfToken = null;

async function request(path, options = {}) {
  const method = options.method || 'GET';
  const headers = new Headers(options.headers || {});

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (!['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase()) && csrfToken) {
    headers.set('X-CSRF-Token', csrfToken);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    method,
    headers,
    credentials: 'include',
  });

  const payload = await response.json().catch(() => ({ error: 'INVALID_RESPONSE' }));
  if (!response.ok) {
    const error = new Error(payload.message || payload.error || 'Request failed');
    error.status = response.status;
    error.code = payload.error;
    throw error;
  }

  if (payload.csrfToken) csrfToken = payload.csrfToken;
  return payload;
}

export async function authenticateTelegram(initData) {
  return request('/auth/telegram', {
    method: 'POST',
    body: JSON.stringify({ initData }),
  });
}

export function fetchHomeContent() {
  return request('/content/home');
}

export function fetchMapContent(region) {
  return request(`/content/map?region=${encodeURIComponent(region)}`);
}

export function fetchPlace(slug) {
  return request(`/content/places/${encodeURIComponent(slug)}`);
}

export function fetchTimeline() {
  return request('/content/timeline');
}

export function searchPlaces(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  });
  return request(`/content/search?${params.toString()}`);
}

export function fetchMe() {
  return request('/me');
}

export function toggleFavorite(placeId) {
  return request(`/favorites/${encodeURIComponent(placeId)}`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}
