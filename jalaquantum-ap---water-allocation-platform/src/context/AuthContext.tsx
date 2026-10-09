import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api, getAuthToken, clearAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (payload: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name?: string; phone?: string; commandArea?: string }) => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initAuth() {
      const token = getAuthToken();
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch (err: any) {
          console.warn('Session verification failed:', err.message);
          clearAuthToken();
          setUser(null);
        }
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setError(null);
    try {
      const res = await api.login(email, pass);
      setUser(res.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (payload: Partial<User> & { password: string }) => {
    setError(null);
    try {
      const res = await api.register(payload);
      setUser(res.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  const updateProfile = async (data: { name?: string; phone?: string; commandArea?: string }) => {
    try {
      const res = await api.updateProfile(data);
      setUser(res.user);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const hasRole = (roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateProfile, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
