import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, BarChart3, History, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Cube Timer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Track your Rubik&apos;s cube solves with precision. Analyze your progress, 
            manage sessions, and improve your times with beautiful visualizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/signup">
                Get Started
                <Zap className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Timer className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Precision Timer</CardTitle>
              <CardDescription>
                Spacebar-controlled timer with millisecond accuracy and visual feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hold spacebar to ready, release to start, press to stop. 
                Supports multiple puzzle types with official scrambles.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Advanced Statistics</CardTitle>
              <CardDescription>
                Track Ao5, Ao12, Ao100, and visualize your progress over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Beautiful charts and graphs help you understand your solving patterns 
                and identify areas for improvement.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <History className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Session Management</CardTitle>
              <CardDescription>
                Organize your solves into sessions and manage your solving history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create multiple sessions for different puzzle types, 
                export your data, and never lose your progress.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to improve your times?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of speedcubers tracking their progress with Cube Timer
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/signup">
              Start Timing Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
