'use client';

import { useEffect } from 'react';
import { useSessionStore } from '@/store/useSessionStore';
import Timer from '@/components/timer/Timer';
import Scramble from '@/components/timer/Scramble';
import SessionDropdown from '@/components/timer/SessionDropdown';

export default function TimerPage() {
  const { loadSessions, initializeDefaultSessions } = useSessionStore();

  useEffect(() => {
    // Load existing sessions and ensure default sessions exist
    const initializeSessions = async () => {
      await loadSessions();
      await initializeDefaultSessions();
    };
    initializeSessions();
  }, [loadSessions, initializeDefaultSessions]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-8 overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Cube Timer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your solves and improve your times
          </p>
        </div>

        {/* Top Row - Scramble and Session (2:1 ratio) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Scramble />
          <SessionDropdown />
        </div>

        {/* Bottom Row - Timer (Main Focus) */}
        <div className="flex justify-center">
          <Timer />
        </div>
      </div>
    </div>
  );
}
