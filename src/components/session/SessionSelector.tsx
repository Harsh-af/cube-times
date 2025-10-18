'use client';

import { useState } from 'react';
import { useSessionStore } from '@/store/useSessionStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Settings } from 'lucide-react';
import { formatTime } from '@/lib/format';
import SessionManager from './SessionManager';

export default function SessionSelector() {
  const {
    sessions,
    currentSessionId,
    setCurrentSession,
    getCurrentSession,
  } = useSessionStore();

  const [showManager, setShowManager] = useState(false);
  const currentSession = getCurrentSession();

  const handleSessionChange = (sessionId: string) => {
    setCurrentSession(sessionId);
  };

  if (sessions.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              No sessions yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create your first session to start timing your solves
            </p>
            <Button 
              onClick={() => setShowManager(true)}
              className="transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Session
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Current Session</CardTitle>
            <Button
              onClick={() => setShowManager(true)}
              variant="outline"
              size="sm"
              className="transition-all duration-200 hover:scale-105"
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={currentSessionId || ''} onValueChange={handleSessionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a session" />
              </SelectTrigger>
              <SelectContent>
                {sessions.map((session) => (
                  <SelectItem key={session.id} value={session.id}>
                    {session.name} ({session.puzzleType}) - {session.solves.length} solves
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {currentSession && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Puzzle Type</div>
                    <div className="font-semibold">{currentSession.puzzleType}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Total Solves</div>
                    <div className="font-semibold">{currentSession.solves.length}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Best Time</div>
                    <div className="font-semibold">
                      {currentSession.solves.length > 0
                        ? formatTime(Math.min(...currentSession.solves.map(s => s.time + (s.penalty === '+2' ? 2000 : 0))))
                        : 'N/A'
                      }
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Average</div>
                    <div className="font-semibold">
                      {currentSession.solves.length > 0
                        ? formatTime(currentSession.solves.reduce((sum, s) => sum + s.time + (s.penalty === '+2' ? 2000 : 0), 0) / currentSession.solves.length)
                        : 'N/A'
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <SessionManager open={showManager} onOpenChange={setShowManager} />
    </>
  );
}
