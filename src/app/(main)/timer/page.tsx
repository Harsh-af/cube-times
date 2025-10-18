'use client';

import { useEffect } from 'react';
import { useSessionStore } from '@/store/useSessionStore';
import Timer from '@/components/timer/Timer';
import Scramble from '@/components/timer/Scramble';

export default function TimerPage() {
  const { loadSessions } = useSessionStore();

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-8 overflow-x-hidden">
      <div className="w-full max-w-none px-4 space-y-8">
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
          {/* <SessionSelector /> */}
          <Timer />
        </div>
      </div>
    </div>
  );
}
