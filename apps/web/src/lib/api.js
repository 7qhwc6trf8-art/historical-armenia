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

export async function fetchHomeContent() {
  return request('/content/home');
}

export async function fetchMe() {
  return request('/me');
}

export async function toggleFavorite(placeId) {
  return request(`/favorites/${encodeURIComponent(placeId)}`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}
