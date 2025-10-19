import { create } from 'zustand';
import { Session, Solve, PuzzleType } from '@/types';
import { formatTime } from '@/lib/format';
import { toast } from 'sonner';

// API response types
interface ApiSession {
  id: string;
  name: string;
  puzzleType: string;
  createdAt: string;
  solves: ApiSolve[];
}

interface ApiSolve {
  id: string;
  time: number;
  scramble: string;
  puzzleType: string;
  sessionId: string;
  timestamp: string;
  penalty?: string;
}

interface SessionStore {
  sessions: Session[];
  currentSessionId: string | null;
  currentScramble: string;
  currentPuzzleType: PuzzleType;
  isLoading: boolean;
  
  // Actions
  loadSessions: () => Promise<void>;
  createSession: (name: string, puzzleType: PuzzleType) => Promise<void>;
  updateSession: (id: string, updates: Partial<Session>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  setCurrentSession: (id: string) => void;
  addSolve: (solve: Omit<Solve, 'id' | 'timestamp'>) => Promise<void>;
  updateSolve: (solveId: string, updates: Partial<Solve>) => Promise<void>;
  deleteSolve: (solveId: string) => Promise<void>;
  setScramble: (scramble: string) => void;
  setPuzzleType: (puzzleType: PuzzleType) => void;
  getCurrentSession: () => Session | null;
  getSessionSolves: (sessionId: string) => Solve[];
  initializeDefaultSessions: () => Promise<void>;
  resetSessions: () => Promise<void>;
  resetSessionsFromAPI: () => Promise<void>;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  currentSessionId: null,
  currentScramble: '',
  currentPuzzleType: '3x3',
  isLoading: false,
  
  loadSessions: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/sessions');
      
      if (!response.ok) {
        throw new Error('Failed to load sessions');
      }

      const sessions = await response.json();
      
      // Transform timestamps from strings to Date objects
      const transformedSessions = sessions.map((session: ApiSession) => ({
        id: session.id,
        name: session.name,
        puzzleType: session.puzzleType as PuzzleType,
        createdAt: new Date(session.createdAt),
        solves: session.solves.map((solve: ApiSolve) => ({
          id: solve.id,
          time: solve.time,
          scramble: solve.scramble,
          puzzleType: solve.puzzleType as PuzzleType,
          sessionId: solve.sessionId,
          timestamp: new Date(solve.timestamp),
          penalty: solve.penalty as 'DNF' | '+2' | undefined,
        })),
      }));
      
      set({ sessions: transformedSessions, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error loading sessions:', error);
      toast.error('Failed to load sessions');
    }
  },
  
  createSession: async (name, puzzleType) => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, puzzleType }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const newSession = await response.json();
      
      set((state) => ({
        sessions: [...state.sessions, newSession],
        currentSessionId: newSession.id,
        isLoading: false,
      }));
      
      toast.success(`Session "${name}" created successfully`);
    } catch (error) {
      set({ isLoading: false });
      console.error('Error creating session:', error);
      toast.error('Failed to create session');
    }
  },
  
  updateSession: async (id, updates) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/sessions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update session');
      }

      set((state) => ({
        sessions: state.sessions.map(session =>
          session.id === id ? { ...session, ...updates } : session
        ),
        isLoading: false,
      }));
      
      toast.success('Session updated successfully');
    } catch (error) {
      set({ isLoading: false });
      console.error('Error updating session:', error);
      toast.error('Failed to update session');
    }
  },
  
  deleteSession: async (id) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/sessions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete session');
      }

      const sessionToDelete = get().sessions.find(s => s.id === id);
      
      set((state) => {
        const updatedSessions = state.sessions.filter(session => session.id !== id);
        const newCurrentSessionId = state.currentSessionId === id ? null : state.currentSessionId;
        
        return { 
          sessions: updatedSessions,
          currentSessionId: newCurrentSessionId,
          isLoading: false,
        };
      });
      
      if (sessionToDelete) {
        toast.success(`Session "${sessionToDelete.name}" deleted`);
      }
    } catch (error) {
      set({ isLoading: false });
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    }
  },
  
  setCurrentSession: (id) => {
    set({ currentSessionId: id });
  },
  
  addSolve: async (solveData) => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/solves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(solveData),
      });

      if (!response.ok) {
        throw new Error('Failed to add solve');
      }

          const newSolve: ApiSolve = await response.json();
          // Transform timestamp from string to Date object
          const transformedSolve: Solve = {
            id: newSolve.id,
            time: newSolve.time,
            scramble: newSolve.scramble,
            puzzleType: newSolve.puzzleType as PuzzleType,
            sessionId: newSolve.sessionId,
            timestamp: new Date(newSolve.timestamp),
            penalty: newSolve.penalty as 'DNF' | '+2' | undefined,
          };
      
      set((state) => ({
        sessions: state.sessions.map(session =>
          session.id === solveData.sessionId
            ? { ...session, solves: [...session.solves, transformedSolve] }
            : session
        ),
        isLoading: false,
      }));
      
      const timeStr = formatTime(newSolve.time + (newSolve.penalty === '+2' ? 2000 : 0));
      toast.success(`Solve recorded: ${timeStr}`);
    } catch (error) {
      set({ isLoading: false });
      console.error('Error adding solve:', error);
      toast.error('Failed to record solve');
    }
  },
  
  updateSolve: async (solveId, updates) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/solves/${solveId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update solve');
      }

      const updatedSolve = await response.json();
      
      set((state) => ({
        sessions: state.sessions.map(session => ({
          ...session,
          solves: session.solves.map(solve =>
            solve.id === solveId ? updatedSolve : solve
          ),
        })),
        isLoading: false,
      }));
      
      toast.success('Solve updated successfully');
    } catch (error) {
      set({ isLoading: false });
      console.error('Error updating solve:', error);
      toast.error('Failed to update solve');
    }
  },
  
  deleteSolve: async (solveId) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/solves/${solveId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete solve');
      }

      set((state) => ({
        sessions: state.sessions.map(session => ({
          ...session,
          solves: session.solves.filter(solve => solve.id !== solveId),
        })),
        isLoading: false,
      }));
      
      toast.success('Solve deleted successfully');
    } catch (error) {
      set({ isLoading: false });
      console.error('Error deleting solve:', error);
      toast.error('Failed to delete solve');
    }
  },
  
  setScramble: (scramble) => set({ currentScramble: scramble }),
  setPuzzleType: (puzzleType) => set({ currentPuzzleType: puzzleType }),
  
  getCurrentSession: () => {
    const { sessions, currentSessionId } = get();
    return sessions.find(session => session.id === currentSessionId) || null;
  },
  
  getSessionSolves: (sessionId) => {
    const { sessions } = get();
    const session = sessions.find(s => s.id === sessionId);
    return session ? session.solves : [];
  },

  initializeDefaultSessions: async () => {
    const { sessions } = get();
    
    try {
      // Check if we already have the required sessions
      const hasDefault = sessions.some(s => s.name === 'Default Session');
      const hasPlayground = sessions.some(s => s.name === 'Playground');
      
      // Always ensure these two sessions exist
      if (!hasDefault) {
        console.log('Creating Default Session...');
        await get().createSession('Default Session', '3x3');
      }
      
      if (!hasPlayground) {
        console.log('Creating Playground session...');
        await get().createSession('Playground', '3x3');
      }
      
      // Clean up any extra sessions (keep only Default Session and Playground)
      const extraSessions = sessions.filter(s => 
        s.name !== 'Default Session' && s.name !== 'Playground'
      );
      
      if (extraSessions.length > 0) {
        console.log(`Cleaning up ${extraSessions.length} extra sessions...`);
        for (const session of extraSessions) {
          try {
            await get().deleteSession(session.id);
          } catch (error) {
            console.error('Error deleting extra session:', error);
          }
        }
      }
      
      console.log('Default sessions initialized');
    } catch (error) {
      console.error('Error initializing default sessions:', error);
    }
  },

  resetSessions: async () => {
    try {
      // Clear all sessions from state
      set({ sessions: [], currentSessionId: null });
      
      // Create exactly 2 sessions
      await get().createSession('Default Session', '3x3');
      await get().createSession('Playground', '3x3');
      
      console.log('Sessions completely reset');
    } catch (error) {
      console.error('Error resetting sessions:', error);
    }
  },

  resetSessionsFromAPI: async () => {
    console.log('Starting resetSessionsFromAPI...');
    set({ isLoading: true });
    try {
      console.log('Calling /api/sessions/reset...');
      const response = await fetch('/api/sessions/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Failed to reset sessions: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      
      // Transform the sessions to match our format
      const transformedSessions = result.sessions.map((session: ApiSession) => ({
        id: session.id,
        name: session.name,
        puzzleType: session.puzzleType as PuzzleType,
        createdAt: new Date(session.createdAt),
        solves: [],
      }));

      console.log('Transformed sessions:', transformedSessions);
      set({ 
        sessions: transformedSessions, 
        currentSessionId: transformedSessions[0]?.id || null,
        isLoading: false 
      });
      
      console.log('Sessions reset from API successfully, count:', transformedSessions.length);
    } catch (error) {
      set({ isLoading: false });
      console.error('Error resetting sessions from API:', error);
    }
  },
}));