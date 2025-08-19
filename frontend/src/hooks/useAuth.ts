'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '@/services/authService';
import type { UserSession } from '@/types/auth';

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = AuthService.getCurrentUser();
    if (userData?.isLoggedIn) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = (userData: UserSession) => {
    AuthService.saveUser(userData);
    setUser(userData);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user?.isLoggedIn
  };
}