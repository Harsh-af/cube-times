'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@stackframe/stack';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Cube Timer...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to timer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32 min-h-screen flex items-center">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main heading with gradient text */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-fade-in animate-gradient">
              Cube Timer
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              Master the art of speedcubing with precision timing, advanced analytics, 
              and beautiful visualizations. Track your progress and achieve new personal bests.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up delay-400">
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 btn-glow">
                <Link href="/signup" className="flex items-center">
                  Start Timing Now
                  <Zap className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
                <Link href="/login" className="flex items-center">
                  Sign In
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Stats preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto animate-fade-in-up delay-600">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">0.001s</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Precision</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">7+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Puzzle Types</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">∞</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Free</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 lg:py-32">
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
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
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
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
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
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
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
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
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
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
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
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
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
      <footer className="py-12 bg-gray-900 dark:bg-black">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
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