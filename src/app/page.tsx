'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@stackframe/stack';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Timer, BarChart3, History, Zap, Target, Clock, Trophy, ChevronRight } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
        router.push('/timer');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-24">
          <div className="space-y-8">
            <Skeleton className="h-20 w-3/4 mx-auto" />
            <div className="space-y-4 max-w-3xl mx-auto">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-4/6" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="h-16 w-48" />
              <Skeleton className="h-16 w-48" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-sm px-4">
          <Skeleton className="h-14" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/25 dark:bg-blue-400/30 rounded-full filter blur-2xl opacity-95 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/25 dark:bg-blue-400/30 rounded-full filter blur-2xl opacity-95 animate-pulse delay-1000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-600/25 dark:bg-blue-400/30 rounded-full filter blur-2xl opacity-95 animate-pulse delay-500"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32 min-h-screen flex items-center">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main heading with gradient text */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-gray-900 dark:text-white animate-fade-in">
              Cube Timer
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              Master the art of speedcubing with precision timing, advanced analytics, 
              and beautiful visualizations. Track your progress and achieve new personal bests.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up delay-400">
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-black hover:bg-gray-900 text-white shadow-lg transition-all duration-300 transform hover:scale-105">
                <Link href="/timer" className="flex items-center">
                  Start Timing Now
                  <Zap className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:border-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300">
                <Link href="/login" className="flex items-center">
                  Sign In
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Stats preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto animate-fade-in-up delay-600">
              <div className="text-center">
                <div className="text-3xl font-mono font-semibold text-blue-600 dark:text-blue-400">0.001s</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Precision</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-mono font-semibold text-blue-600 dark:text-blue-400">7+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Puzzle Types</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-mono font-semibold text-blue-600 dark:text-blue-400">∞</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-mono font-semibold text-blue-600 dark:text-blue-400">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Free</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 lg:py-32 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-1/2 w-72 h-72 bg-blue-600/20 dark:bg-blue-400/30 rounded-full blur-2xl opacity-90 animate-pulse"></div>
          <div className="absolute -bottom-24 right-1/4 w-72 h-72 bg-blue-600/20 dark:bg-blue-400/30 rounded-full blur-2xl opacity-90 animate-pulse delay-700"></div>
        </div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything you need to improve
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed specifically for speedcubers who want to track, analyze, and improve their solving times.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Precision Timer Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm card-hover">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-blue-600 dark:bg-blue-500 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-200/40 dark:shadow-blue-900/40">
                  <Timer className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Precision Timer</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Spacebar-controlled timer with millisecond accuracy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  Hold spacebar to ready, release to start, press to stop. 
                  Supports multiple puzzle types with official scrambles and visual feedback.
                </p>
              </CardContent>
            </Card>

            {/* Advanced Statistics Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm card-hover">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-indigo-600 dark:bg-indigo-500 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-200/40 dark:shadow-indigo-900/40">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Statistics</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Track Ao5, Ao12, Ao100 with beautiful visualizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  Beautiful charts and graphs help you understand your solving patterns 
                  and identify areas for improvement with detailed analytics.
                </p>
              </CardContent>
            </Card>

            {/* Session Management Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm card-hover">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-emerald-600 dark:bg-emerald-500 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-200/40 dark:shadow-emerald-900/40">
                  <History className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Session Management</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Organize solves into sessions and manage your history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  Create multiple sessions for different puzzle types, 
                  export your data, and never lose your progress with cloud sync.
                </p>
              </CardContent>
            </Card>

            {/* Puzzle Types Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm card-hover">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-fuchsia-600 dark:bg-fuchsia-500 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-fuchsia-200/40 dark:shadow-fuchsia-900/40">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Multiple Puzzles</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  2x2, 3x3, 4x4, 5x5, Pyraminx, Megaminx, and Skewb
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  Official scrambles for 7+ different puzzle types. 
                  Track your progress across all your favorite puzzles in one place.
                </p>
              </CardContent>
            </Card>

            {/* Real-time Analytics Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm card-hover">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-cyan-600 dark:bg-cyan-500 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-200/40 dark:shadow-cyan-900/40">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Real-time Analytics</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Live statistics and progress tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  See your averages, best times, and progress in real-time. 
                  Get insights that help you improve faster.
                </p>
              </CardContent>
            </Card>

            {/* Achievements Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm card-hover">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-amber-500 dark:bg-amber-400 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-200/40 dark:shadow-amber-900/40">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Track milestones and personal records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  Celebrate your achievements and track personal records. 
                  Stay motivated with milestone tracking and progress rewards.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>


      {/* Footer */}
      <footer className="relative z-10 py-12 bg-gray-900 dark:bg-black">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Timer className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Cube Timer</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            Built with ❤️ for the speedcubing community
            <br />
            By: Harsh Karanwal
          </p>
        </div>
      </footer>
    </div>
  );
}