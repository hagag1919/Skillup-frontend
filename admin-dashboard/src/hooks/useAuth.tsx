import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginRequest } from '../types';
import { apiService } from '../services/apiService';
import { AuthContext } from './useAuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          const userData = await apiService.validateToken();
          setUser(userData);
        } catch (error) {
          console.error('Token validation failed:', error);
          // Clear invalid token
          localStorage.removeItem('admin_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await apiService.login(credentials);
    setUser(response.user);
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
