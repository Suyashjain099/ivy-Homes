const BASE_URL = 'https://solve.ivy.homes';
const API_KEY = 'IVY26-6814CC79648F';

export class APIError extends Error {
  constructor(status, detail) {
    super(typeof detail === 'string' ? detail : JSON.stringify(detail));
    self.status = status;
    self.detail = detail;
  }
}

let tokenState = {
  accessToken: localStorage.getItem('ivy_access_token') || null,
  refreshToken: localStorage.getItem('ivy_refresh_token') || null
};

export const setAuthTokens = (access, refresh) => {
  tokenState.accessToken = access;
  tokenState.refreshToken = refresh;
  if (access) localStorage.setItem('ivy_access_token', access);
  else localStorage.removeItem('ivy_access_token');
  
  if (refresh) localStorage.setItem('ivy_refresh_token', refresh);
  else localStorage.removeItem('ivy_refresh_token');
};

export const getAuthToken = () => tokenState.accessToken;

export const refreshAuthToken = async () => {
  if (!tokenState.refreshToken) return null;
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: tokenState.refreshToken })
    });
    if (res.ok) {
      const data = await res.json();
      setAuthTokens(data.access_token, data.refresh_token || tokenState.refreshToken);
      return data.access_token;
    } else {
      setAuthTokens(null, null);
      return null;
    }
  } catch (err) {
    console.error('Failed to refresh token:', err);
    setAuthTokens(null, null);
    return null;
  }
};

export const request = async (path, options = {}) => {
  const headers = {
    'X-API-Key': API_KEY,
    ...(options.headers || {})
  };

  if (tokenState.accessToken && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${tokenState.accessToken}`;
  }

  if (options.body && typeof options.body === 'object' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const url = `${BASE_URL}${path}`;
  let response = await fetch(url, { ...options, headers });

  // Handle 401 unauthorized & auto-refresh
  if (response.status === 401 && tokenState.refreshToken && !options._retry) {
    const newToken = await refreshAuthToken();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, { ...options, headers, _retry: true });
    }
  }

  if (!response.ok) {
    let detail = 'Request failed';
    try {
      const errData = await response.json();
      detail = errData.detail || errData;
    } catch {
      detail = await response.text();
    }
    throw new APIError(response.status, detail);
  }

  if (response.status === 24) return null;
  return await response.json();
};
