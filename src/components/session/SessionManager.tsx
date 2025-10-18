'use client';

import { useState } from 'react';
import { useSessionStore } from '@/store/useSessionStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Download, Upload } from 'lucide-react';
import { PuzzleType } from '@/types';
import { formatTime } from '@/lib/format';

interface SessionManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SessionManager({ open, onOpenChange }: SessionManagerProps) {
  const {
    sessions,
    currentSessionId,
    createSession,
    deleteSession,
    setCurrentSession,
  } = useSessionStore();

  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionPuzzleType, setNewSessionPuzzleType] = useState<PuzzleType>('3x3');

  const handleCreateSession = () => {
    if (newSessionName.trim()) {
      createSession(newSessionName.trim(), newSessionPuzzleType);
      setNewSessionName('');
      setNewSessionPuzzleType('3x3');
    }
  };


  const handleDeleteSession = (id: string) => {
    if (confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      deleteSession(id);
    }
  };

  const handleExportSessions = () => {
    const dataStr = JSON.stringify(sessions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cube-timer-sessions.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSessions = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSessions = JSON.parse(e.target?.result as string);
          // In a real app, you'd validate and merge this data
          console.log('Imported sessions:', importedSessions);
        } catch (error) {
          console.error('Error importing sessions:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Sessions</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create New Session */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create New Session</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="sessionName">Session Name</Label>
                  <Input
                    id="sessionName"
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                    placeholder="Enter session name"
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor="puzzleType">Puzzle Type</Label>
                  <Select value={newSessionPuzzleType} onValueChange={(value: PuzzleType) => setNewSessionPuzzleType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                <div className="flex items-end">
                  <Button 
                    onClick={handleCreateSession} 
                    disabled={!newSessionName.trim()}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Import/Export */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Button 
                  onClick={handleExportSessions} 
                  variant="outline"
                  className="transition-all duration-200 hover:scale-105"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Sessions
                </Button>
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportSessions}
                    className="hidden"
                    id="import-sessions"
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="import-sessions" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Sessions
                    </label>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sessions List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Sessions</h3>
            {sessions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sessions created yet</p>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => (
                  <Card key={session.id} className={currentSessionId === session.id ? 'ring-2 ring-blue-500' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{session.name}</h4>
                            <span className="text-sm text-gray-500">({session.puzzleType})</span>
                            {currentSessionId === session.id && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {session.solves?.length || 0} solves • Created {new Date(session.createdAt).toLocaleDateString()}
                            {session.solves && session.solves.length > 0 && (
                              <>
                                {' • Best: '}
                                {formatTime(Math.min(...session.solves.map(s => s.time + (s.penalty === '+2' ? 2000 : 0))))}
                                {' • Avg: '}
                                {formatTime(session.solves.reduce((sum, s) => sum + s.time + (s.penalty === '+2' ? 2000 : 0), 0) / session.solves.length)}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setCurrentSession(session.id)}
                            variant="outline"
                            size="sm"
                          >
                            Select
                          </Button>
                          <Button
                            onClick={() => {}}
                            variant="outline"
                            size="sm"
                            disabled
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteSession(session.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
