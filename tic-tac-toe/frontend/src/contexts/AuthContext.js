'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { socketClient } from '@/lib/socket';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = apiClient.getToken();
      if (token) {
        const profile = await apiClient.getProfile();
        setUser(profile);
        setIsAuthenticated(true);
        socketClient.connect(token);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      apiClient.clearToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await apiClient.login(username, password);
      setUser(response.user);
      setIsAuthenticated(true);
      socketClient.connect(response.access_token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // >>> Ajuste: cadastro não autentica nem conecta socket
  const register = async (username, password) => {
    try {
      const response = await apiClient.register(username, password);
      return response; // Apenas retorna sucesso; UI alterna para Login
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (e) {
      // ignora
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      socketClient.disconnect();
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
