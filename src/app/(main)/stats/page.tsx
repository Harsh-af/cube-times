'use client';

import { useEffect, useState } from 'react';
import { useSessionStore } from '@/store/useSessionStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { calculateStatistics } from '@/lib/statistics';
import StatCard from '@/components/stats/StatCard';
import TimeChart from '@/components/stats/TimeChart';
import DistributionChart from '@/components/stats/DistributionChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StatsPage() {
  const { sessions, loadSessions, getCurrentSession, isLoading } = useSessionStore();
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

  const currentSession = getCurrentSession();
  const stats = currentSession && currentSession.solves ? calculateStatistics(currentSession.solves) : null;

  // Get all solves from all sessions for overall statistics
  const allSolves = sessions.flatMap(session => session.solves || []);
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
          <Tabs defaultValue="overall" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overall">Overall Statistics</TabsTrigger>
              <TabsTrigger value="current" disabled={!currentSession || !currentSession.solves || currentSession.solves.length === 0}>
                Current Session
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overall" className="space-y-8 mt-8">
              {/* Overall Basic Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Solves"
                  value={overallStats?.totalSolves}
                  subtitle="All time"
                />
                <StatCard
                  title="Best Time"
                  value={overallStats?.bestTime}
                  subtitle="Personal best"
                />
                <StatCard
                  title="Worst Time"
                  value={overallStats?.worstTime}
                  subtitle="Slowest solve"
                />
                <StatCard
                  title="Mean"
                  value={overallStats?.mean}
                  subtitle="Average time"
                />
              </div>

              {/* Overall Advanced Averages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                  title="Average of 5"
                  value={overallStats?.ao5}
                  subtitle="Best 5 consecutive"
                  className="border-blue-200 dark:border-blue-800"
                />
                <StatCard
                  title="Average of 12"
                  value={overallStats?.ao12}
                  subtitle="Best 12 consecutive"
                  className="border-green-200 dark:border-green-800"
                />
                <StatCard
                  title="Average of 100"
                  value={overallStats?.ao100}
                  subtitle="Best 100 consecutive"
                  className="border-purple-200 dark:border-purple-800"
                />
              </div>

              {/* Overall Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TimeChart
                  solves={allSolves}
                  title="Solve Times Over Time (All Sessions)"
                />
                <DistributionChart
                  solves={allSolves}
                  title="Time Distribution (All Sessions)"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="current" className="space-y-8 mt-8">
              {currentSession && currentSession.solves && currentSession.solves.length > 0 ? (
                <>
                  {/* Current Session Basic Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                      title="Total Solves"
                      value={stats?.totalSolves}
                      subtitle="Current session"
                    />
                    <StatCard
                      title="Best Time"
                      value={stats?.bestTime}
                      subtitle="Session best"
                    />
                    <StatCard
                      title="Worst Time"
                      value={stats?.worstTime}
                      subtitle="Session worst"
                    />
                    <StatCard
                      title="Mean"
                      value={stats?.mean}
                      subtitle="Session average"
                    />
                  </div>

                  {/* Current Session Advanced Averages */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard
                      title="Average of 5"
                      value={stats?.ao5}
                      subtitle="Best 5 consecutive"
                      className="border-blue-200 dark:border-blue-800"
                    />
                    <StatCard
                      title="Average of 12"
                      value={stats?.ao12}
                      subtitle="Best 12 consecutive"
                      className="border-green-200 dark:border-green-800"
                    />
                    <StatCard
                      title="Average of 100"
                      value={stats?.ao100}
                      subtitle="Best 100 consecutive"
                      className="border-purple-200 dark:border-purple-800"
                    />
                  </div>

                  {/* Current Session Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <TimeChart
                      solves={currentSession.solves}
                      title="Solve Times Over Time (Current Session)"
                    />
                    <DistributionChart
                      solves={currentSession.solves}
                      title="Time Distribution (Current Session)"
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
                </>
              ) : (
                <Card className="w-full max-w-2xl mx-auto">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No current session
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Select a session with solves to view session-specific statistics
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
