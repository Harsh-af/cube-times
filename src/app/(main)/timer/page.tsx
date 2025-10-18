'use client';

import { useEffect } from 'react';
import { useSessionStore } from '@/store/useSessionStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Timer from '@/components/timer/Timer';
import Scramble from '@/components/timer/Scramble';
import SessionSelector from '@/components/session/SessionSelector';

export default function TimerPage() {
  const { loadSessions } = useSessionStore();
  const { loadAuth, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadAuth();
    loadSessions();
  }, [loadAuth, loadSessions]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Cube Timer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your solves and improve your times
          </p>
        </div>

        <div className="space-y-8 max-w-4xl mx-auto">
          <Scramble />
          <Timer />
        </div>
      </div>
    </div>
  );
}
