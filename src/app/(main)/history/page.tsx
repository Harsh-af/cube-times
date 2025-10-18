'use client';

import { useEffect, useState } from 'react';
import { useSessionStore } from '@/store/useSessionStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { formatTime } from '@/lib/format';
import { Solve } from '@/types';
import { Trash2, Edit, X, Check } from 'lucide-react';

export default function HistoryPage() {
  const { loadSessions, sessions, updateSolve, deleteSolve } = useSessionStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [filteredSolves, setFilteredSolves] = useState<Solve[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>('all');
  const [selectedPuzzleType, setSelectedPuzzleType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSolve, setEditingSolve] = useState<string | null>(null);
  const [editTime, setEditTime] = useState('');

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    let solves: Solve[] = [];
    
    if (selectedSession === 'all') {
      solves = sessions.flatMap(session => session.solves || []);
    } else {
      const session = sessions.find(s => s.id === selectedSession);
      solves = session && session.solves ? session.solves : [];
    }

    if (selectedPuzzleType !== 'all') {
      solves = solves.filter(solve => solve.puzzleType === selectedPuzzleType);
    }

    if (searchTerm) {
      solves = solves.filter(solve => 
        solve.scramble.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatTime(solve.time).includes(searchTerm)
      );
    }

    // Sort by timestamp (newest first)
    solves.sort((a, b) => {
      const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
      const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
      return bTime - aTime;
    });

    setFilteredSolves(solves);
  }, [sessions, selectedSession, selectedPuzzleType, searchTerm]);

  const handleEditSolve = (solve: Solve) => {
    setEditingSolve(solve.id);
    setEditTime(formatTime(solve.time));
  };

  const handleSaveEdit = () => {
    if (editingSolve && editTime) {
      const timeInMs = parseFloat(editTime.replace(':', '')) * 1000;
      updateSolve(editingSolve, { time: timeInMs });
      setEditingSolve(null);
      setEditTime('');
    }
  };

  const handleCancelEdit = () => {
    setEditingSolve(null);
    setEditTime('');
  };

  const handleTogglePenalty = (solveId: string, currentPenalty?: string) => {
    let newPenalty: 'DNF' | '+2' | undefined;
    if (!currentPenalty) {
      newPenalty = '+2';
    } else if (currentPenalty === '+2') {
      newPenalty = 'DNF';
    } else {
      newPenalty = undefined;
    }
    updateSolve(solveId, { penalty: newPenalty });
  };

  const handleDeleteSolve = (solveId: string) => {
    if (confirm('Are you sure you want to delete this solve?')) {
      deleteSolve(solveId);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Solve History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all your solves
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Session
                </label>
                <Select value={selectedSession} onValueChange={setSelectedSession}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sessions</SelectItem>
                    {sessions.map(session => (
                      <SelectItem key={session.id} value={session.id}>
                        {session.name} ({session.puzzleType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Puzzle Type
                </label>
                <Select value={selectedPuzzleType} onValueChange={setSelectedPuzzleType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="2x2">2x2</SelectItem>
                    <SelectItem value="3x3">3x3</SelectItem>
                    <SelectItem value="4x4">4x4</SelectItem>
                    <SelectItem value="5x5">5x5</SelectItem>
                    <SelectItem value="pyraminx">Pyraminx</SelectItem>
                    <SelectItem value="megaminx">Megaminx</SelectItem>
                    <SelectItem value="skewb">Skewb</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Search
                </label>
                <Input
                  placeholder="Search solves..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSelectedSession('all');
                    setSelectedPuzzleType('all');
                    setSearchTerm('');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solves List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Solves ({filteredSolves.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSolves.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No solves found matching your filters
              </div>
            ) : (
              <div className="space-y-2">
                {filteredSolves.map((solve) => (
                  <div
                    key={solve.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Time</div>
                        <div className="font-mono text-lg">
                          {editingSolve === solve.id ? (
                            <Input
                              value={editTime}
                              onChange={(e) => setEditTime(e.target.value)}
                              className="w-24 h-8"
                            />
                          ) : (
                            formatTime(solve.time + (solve.penalty === '+2' ? 2000 : 0))
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Scramble</div>
                        <div className="font-mono text-sm truncate max-w-48">
                          {solve.scramble}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Puzzle</div>
                        <div className="font-semibold">{solve.puzzleType}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Date</div>
                        <div className="text-sm">
                          {solve.timestamp instanceof Date 
                            ? `${solve.timestamp.toLocaleDateString()} ${solve.timestamp.toLocaleTimeString()}`
                            : `${new Date(solve.timestamp).toLocaleDateString()} ${new Date(solve.timestamp).toLocaleTimeString()}`
                          }
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {editingSolve === solve.id ? (
                        <>
                          <Button
                            onClick={handleSaveEdit}
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => handleTogglePenalty(solve.id, solve.penalty)}
                            size="sm"
                            variant="outline"
                            className={
                              solve.penalty === 'DNF' ? 'text-red-600' :
                              solve.penalty === '+2' ? 'text-yellow-600' :
                              'text-gray-600'
                            }
                          >
                            {solve.penalty === 'DNF' ? 'DNF' :
                             solve.penalty === '+2' ? '+2' : 'OK'}
                          </Button>
                          <Button
                            onClick={() => handleEditSolve(solve)}
                            size="sm"
                            variant="outline"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteSolve(solve.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
