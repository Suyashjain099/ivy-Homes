import { request, setAuthTokens } from './apiClient';

export const authApi = {
  login: async (email, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    // Server returns access_token & refresh_token
    if (data.access_token) {
      setAuthTokens(data.access_token, data.refresh_token);
    }
    return data;
  },
  
  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Logout server request failed:', err);
    } finally {
      setAuthTokens(null, null);
    }
  }
};
