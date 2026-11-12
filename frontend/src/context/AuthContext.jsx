import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('vrms_user');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch (err) {
        console.error('Failed to parse stored auth session:', err);
        localStorage.removeItem('vrms_user');
      }
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    const response = await axiosClient.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = response.data;
    
    setUser(receivedUser);
    setToken(receivedToken);
    localStorage.setItem('vrms_user', JSON.stringify({ token: receivedToken, user: receivedUser }));
    return response.data;
  };

  // Register handler
  const register = async (userData) => {
    const response = await axiosClient.post('/auth/register', userData);
    const { token: receivedToken, user: receivedUser } = response.data;

    setUser(receivedUser);
    setToken(receivedToken);
    localStorage.setItem('vrms_user', JSON.stringify({ token: receivedToken, user: receivedUser }));
    return response.data;
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vrms_user');
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    const response = await axiosClient.put('/auth/profile', profileData);
    const updatedUser = response.data.user;

    setUser(updatedUser);
    const stored = JSON.parse(localStorage.getItem('vrms_user') || '{}');
    localStorage.setItem('vrms_user', JSON.stringify({ ...stored, user: updatedUser }));
    return response.data;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
