import { create } from 'zustand';
import { Session, Solve, PuzzleType } from '@/types';
import { saveSessions, loadSessions, saveCurrentSessionId, loadCurrentSessionId } from '@/lib/storage';
import { formatTime } from '@/lib/format';
import { toast } from 'sonner';

interface SessionStore {
  sessions: Session[];
  currentSessionId: string | null;
  currentScramble: string;
  currentPuzzleType: PuzzleType;
  
  // Actions
  loadSessions: () => void;
  createSession: (name: string, puzzleType: PuzzleType) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  deleteSession: (id: string) => void;
  setCurrentSession: (id: string) => void;
  addSolve: (solve: Omit<Solve, 'id' | 'timestamp'>) => void;
  updateSolve: (solveId: string, updates: Partial<Solve>) => void;
  deleteSolve: (solveId: string) => void;
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
  
  loadSessions: () => {
    const sessions = loadSessions();
    const currentSessionId = loadCurrentSessionId();
    set({ sessions, currentSessionId });
  },
  
  createSession: (name, puzzleType) => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      name,
      puzzleType,
      createdAt: new Date(),
      solves: [],
    };
    
    set((state) => {
      const updatedSessions = [...state.sessions, newSession];
      saveSessions(updatedSessions);
      return { sessions: updatedSessions };
    });
    
    toast.success(`Session "${name}" created successfully`);
  },
  
  updateSession: (id, updates) => {
    set((state) => {
      const updatedSessions = state.sessions.map(session =>
        session.id === id ? { ...session, ...updates } : session
      );
      saveSessions(updatedSessions);
      return { sessions: updatedSessions };
    });
  },
  
  deleteSession: (id) => {
    set((state) => {
      const sessionToDelete = state.sessions.find(s => s.id === id);
      const updatedSessions = state.sessions.filter(session => session.id !== id);
      saveSessions(updatedSessions);
      
      // If we deleted the current session, clear it
      const newCurrentSessionId = state.currentSessionId === id ? null : state.currentSessionId;
      if (newCurrentSessionId !== state.currentSessionId) {
        saveCurrentSessionId(newCurrentSessionId || '');
      }
      
      if (sessionToDelete) {
        toast.success(`Session "${sessionToDelete.name}" deleted`);
      }
      
      return { 
        sessions: updatedSessions,
        currentSessionId: newCurrentSessionId,
      };
    });
  },
  
  setCurrentSession: (id) => {
    set({ currentSessionId: id });
    saveCurrentSessionId(id);
  },
  
  addSolve: (solveData) => {
    const solve: Solve = {
      ...solveData,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    
    set((state) => {
      const updatedSessions = state.sessions.map(session =>
        session.id === solve.sessionId
          ? { ...session, solves: [...session.solves, solve] }
          : session
      );
      saveSessions(updatedSessions);
      return { sessions: updatedSessions };
    });
    
    const timeStr = formatTime(solve.time + (solve.penalty === '+2' ? 2000 : 0));
    toast.success(`Solve recorded: ${timeStr}`);
  },
  
  updateSolve: (solveId, updates) => {
    set((state) => {
      const updatedSessions = state.sessions.map(session => ({
        ...session,
        solves: session.solves.map(solve =>
          solve.id === solveId ? { ...solve, ...updates } : solve
        ),
      }));
      saveSessions(updatedSessions);
      return { sessions: updatedSessions };
    });
  },
  
  deleteSolve: (solveId) => {
    set((state) => {
      const updatedSessions = state.sessions.map(session => ({
        ...session,
        solves: session.solves.filter(solve => solve.id !== solveId),
      }));
      saveSessions(updatedSessions);
      return { sessions: updatedSessions };
    });
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
}));
