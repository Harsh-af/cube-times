'use client';

import { useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import { useAuthStore } from '@/store/useAuthStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useUser();
  const { setUser, setIsAuthenticated, setIsLoading } = useAuthStore();
  const isLoading = false; // useUser doesn't return isLoading

  useEffect(() => {
    setIsLoading(isLoading);
    
    if (user) {
      setUser({
        id: user.id,
        name: user.displayName,
        email: user.primaryEmail || '',
        image: user.profileImageUrl,
      });
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [user, isLoading, setUser, setIsAuthenticated, setIsLoading]);

  return <>{children}</>;
}