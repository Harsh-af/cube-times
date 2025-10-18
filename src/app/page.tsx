'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@stackframe/stack';

export default function HomePage() {
  const router = useRouter();
  const user = useUser();
  const isLoading = false; // useUser doesn't return isLoading

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/timer');
      } else {
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return null;
}