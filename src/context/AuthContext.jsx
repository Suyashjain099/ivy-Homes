import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import { getAuthToken, refreshAuthToken } from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ivy_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // Auto-refresh token every 12 minutes to sustain session indefinitely
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const interval = setInterval(async () => {
      console.log('Running background session auto-refresh...');
      await refreshAuthToken();
    }, 12 * 60 * 1000); // 12 mins

    setLoading(false);
    return () => clearInterval(interval);
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    const userInfo = data.user || { email };
    setUser(userInfo);
    localStorage.setItem('ivy_user', JSON.stringify(userInfo));
    return data;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    localStorage.removeItem('ivy_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
