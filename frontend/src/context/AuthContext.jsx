import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser } from '../api/authApi';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'carenexus_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  /**
   * Log in user
   * @param {Object} credentials - { username, password }
   */
  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await loginUser(credentials);
      if (data.user) {
        setUser(data.user);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register user
   * @param {Object} userData - { username, email, password }
   */
  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await registerUser(userData);
      return data;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out user
   */
  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
    } catch (err) {
      console.warn('Backend logout encountered error, clearing local state:', err);
    } finally {
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
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
