'use client';

import { Suspense, useEffect } from 'react';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { Skeleton } from '@/components/ui/skeleton';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="w-full max-w-5xl space-y-6">
            <Skeleton className="h-16 w-2/3" />
            <Skeleton className="h-6 w-5/6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
          </div>
        </div>
      }>
        <MainLayoutContent>{children}</MainLayoutContent>
      </Suspense>
    </AuthProvider>
  );
}

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const allowGuestTimer = pathname === '/timer';

  useEffect(() => {
    if (isLoading) return; // Still loading

    if (!isAuthenticated && !allowGuestTimer) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, allowGuestTimer, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-5xl space-y-6">
          <Skeleton className="h-16 w-2/3" />
          <Skeleton className="h-6 w-5/6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !allowGuestTimer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}