'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '@/services/authService';
import type { UserSession } from '@/types/auth';

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Solo ejecutar en cliente
    if (typeof window !== 'undefined') {
      const currentUser = AuthService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    }
  }, []);

  const login = (userData: UserSession) => {
    if (typeof window !== 'undefined') {
      AuthService.saveUser(userData);
      setUser(userData);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      AuthService.logout();
      setUser(null);
    }
  };

  const updateUser = (userData: UserSession) => {
    if (typeof window !== 'undefined') {
      AuthService.saveUser(userData);
      setUser(userData);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user?.isLoggedIn,
  };
}