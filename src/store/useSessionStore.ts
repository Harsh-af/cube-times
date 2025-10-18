import { create } from 'zustand';
import { Session, Solve, PuzzleType } from '@/types';
import { formatTime } from '@/lib/format';
import { toast } from 'sonner';

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
      const transformedSessions = sessions.map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        solves: session.solves.map((solve: any) => ({
          ...solve,
          timestamp: new Date(solve.timestamp),
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

      const newSolve = await response.json();
      // Transform timestamp from string to Date object
      const transformedSolve = {
        ...newSolve,
        timestamp: new Date(newSolve.timestamp),
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
    const { sessions, loadSessions } = get();
    
    // Only initialize if no sessions exist
    if (sessions.length === 0) {
      try {
        // Create Default Session
        await get().createSession('Default Session', '3x3');
        // Create Playground Session
        await get().createSession('Playground', '3x3');
      } catch (error) {
        console.error('Error initializing default sessions:', error);
      }
    }
  },
}));