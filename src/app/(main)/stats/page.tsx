'use client';

import { useEffect } from 'react';
import { useSessionStore } from '@/store/useSessionStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { calculateStatistics } from '@/lib/statistics';
import StatCard from '@/components/stats/StatCard';
import TimeChart from '@/components/stats/TimeChart';
import DistributionChart from '@/components/stats/DistributionChart';
import { Card, CardContent } from '@/components/ui/card';

export default function StatsPage() {
  const { sessions, loadSessions, isLoading } = useSessionStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Get all solves from all sessions (excluding Playground) for overall statistics
  const allSolves = sessions
    .filter(session => session.name !== 'Playground')
    .flatMap(session => session.solves || []);
  const overallStats = allSolves.length > 0 ? calculateStatistics(allSolves) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Statistics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Analyze your solving performance
          </p>
        </div>

        {sessions.length === 0 ? (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No sessions found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create a session and complete some solves to see statistics
              </p>
            </CardContent>
          </Card>
        ) : allSolves.length === 0 ? (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No solves yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Complete some solves to see statistics
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Basic Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Solves"
                value={overallStats?.totalSolves ?? null}
                subtitle="All time"
              />
              <StatCard
                title="Best Time"
                value={overallStats?.bestTime ?? null}
                subtitle="Personal best"
              />
              <StatCard
                title="Worst Time"
                value={overallStats?.worstTime ?? null}
                subtitle="Slowest solve"
              />
              <StatCard
                title="Mean"
                value={overallStats?.mean ?? null}
                subtitle="Average time"
              />
            </div>

            {/* Advanced Averages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                title="Average of 5"
                value={overallStats?.ao5 ?? null}
                subtitle="Best 5 consecutive"
                className="border-blue-200 dark:border-blue-800"
              />
              <StatCard
                title="Average of 12"
                value={overallStats?.ao12 ?? null}
                subtitle="Best 12 consecutive"
                className="border-green-200 dark:border-green-800"
              />
              <StatCard
                title="Average of 100"
                value={overallStats?.ao100 ?? null}
                subtitle="Best 100 consecutive"
                className="border-purple-200 dark:border-purple-800"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TimeChart
                solves={allSolves}
                title="Solve Times Over Time"
              />
              <DistributionChart
                solves={allSolves}
                title="Time Distribution"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
