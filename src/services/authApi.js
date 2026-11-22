const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

export function isApiConfigured() {
  return Boolean(API_BASE_URL);
}

async function request(path, { method = 'GET', body, token } = {}) {
  if (!API_BASE_URL) {
    throw new Error('Authentication is not connected yet. The API address has not been configured.');
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new Error('Could not reach the CTF Root server. Check your connection and try again.');
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.message || payload?.detail || payload?.title;
    if (response.status === 429) {
      throw new Error('Too many attempts. Please wait a minute before trying again.');
    }
    throw new Error(message || 'The request could not be completed. Please check your details and try again.');
  }

  return payload;
}

export function registerAccount({ email, displayName, password }) {
  return request('/api/auth/register', {
    method: 'POST',
    body: { email, displayName, password },
  });
}

export function loginAccount({ email, password }) {
  return request('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function getCurrentUser(token) {
  return request('/api/auth/me', { token });
}

export function storeAuthToken(token) {
  // Temporary session-only storage. A future HttpOnly refresh-cookie flow is preferable.
  window.sessionStorage.setItem('ctfroot.accessToken', token);
}

export function getStoredAuthToken() {
  return window.sessionStorage.getItem('ctfroot.accessToken');
}

export function clearAuthToken() {
  window.sessionStorage.removeItem('ctfroot.accessToken');
}
