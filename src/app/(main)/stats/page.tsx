'use client';

import { useEffect } from 'react';
import { useSessionStore } from '@/store/useSessionStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { calculateStatistics } from '@/lib/statistics';
import StatCard from '@/components/stats/StatCard';
import TimeChart from '@/components/stats/TimeChart';
import DistributionChart from '@/components/stats/DistributionChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StatsPage() {
  const { loadSessions, getCurrentSession } = useSessionStore();
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

  const currentSession = getCurrentSession();
  const stats = currentSession ? calculateStatistics(currentSession.solves) : null;

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

        {!currentSession ? (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No active session
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Select a session to view statistics
              </p>
            </CardContent>
          </Card>
        ) : stats && currentSession.solves.length > 0 ? (
          <div className="space-y-8">
            {/* Basic Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Solves"
                value={stats.totalSolves}
                subtitle="All time"
              />
              <StatCard
                title="Best Time"
                value={stats.bestTime}
                subtitle="Personal best"
              />
              <StatCard
                title="Worst Time"
                value={stats.worstTime}
                subtitle="Slowest solve"
              />
              <StatCard
                title="Mean"
                value={stats.mean}
                subtitle="Average time"
              />
            </div>

            {/* Advanced Averages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                title="Average of 5"
                value={stats.ao5}
                subtitle="Best 5 consecutive"
                className="border-blue-200 dark:border-blue-800"
              />
              <StatCard
                title="Average of 12"
                value={stats.ao12}
                subtitle="Best 12 consecutive"
                className="border-green-200 dark:border-green-800"
              />
              <StatCard
                title="Average of 100"
                value={stats.ao100}
                subtitle="Best 100 consecutive"
                className="border-purple-200 dark:border-purple-800"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TimeChart
                solves={currentSession.solves}
                title="Solve Times Over Time"
              />
              <DistributionChart
                solves={currentSession.solves}
                title="Time Distribution"
              />
            </div>

            {/* Session Info */}
            <Card>
              <CardHeader>
                <CardTitle>Session Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Session Name</div>
                    <div className="font-semibold">{currentSession.name}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Puzzle Type</div>
                    <div className="font-semibold">{currentSession.puzzleType}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Created</div>
                    <div className="font-semibold">{currentSession.createdAt.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Last Solve</div>
                    <div className="font-semibold">
                      {currentSession.solves.length > 0
                        ? currentSession.solves[currentSession.solves.length - 1].timestamp.toLocaleDateString()
                        : 'N/A'
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
