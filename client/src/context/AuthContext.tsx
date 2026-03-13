import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '../api/auth';
import { getMe } from '../api/auth';
import { AuthContext } from './authContextDef';

const TOKEN_KEY = 'roadmappro_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(() => !!localStorage.getItem(TOKEN_KEY));

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const loginUser = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(TOKEN_KEY, newToken);
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;
    getMe(token)
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {
        if (!cancelled) logout();
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
