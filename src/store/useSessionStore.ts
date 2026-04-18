import { create } from 'zustand';
import { Session, Solve, PuzzleType } from '@/types';
import { formatTime } from '@/lib/format';
import { toast } from 'sonner';

const LOCAL_SESSION_KEY = 'cube-timer-local-sessions';

type StorageMode = 'api' | 'local';

const getAnonymousId = (prefix: string) => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const parseLocalSessions = (stored: string): Session[] => {
  try {
    interface ParsedSession {
      id: string;
      name: string;
      puzzleType: string;
      createdAt: string;
      solves: Array<{
        id: string;
        time: number;
        scramble: string;
        puzzleType: string;
        sessionId: string;
        timestamp: string;
        penalty?: string;
      }>;
    }
    const sessions = JSON.parse(stored) as ParsedSession[];
    return sessions.map((session) => ({
      ...session,
      puzzleType: session.puzzleType as PuzzleType,
      createdAt: new Date(session.createdAt),
      solves: (session.solves || []).map((solve: ParsedSession['solves'][0]) => ({
        ...solve,
        puzzleType: solve.puzzleType as PuzzleType,
        penalty: solve.penalty as 'DNF' | '+2' | undefined,
        timestamp: new Date(solve.timestamp),
      })),
    }));
  } catch (error) {
    console.error('Failed to parse local sessions', error);
    return [];
  }
};

const loadLocalSessionsFromStorage = (): Session[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const stored = window.localStorage.getItem(LOCAL_SESSION_KEY);
  if (!stored) {
    return [];
  }

  return parseLocalSessions(stored);
};

const saveLocalSessionsToStorage = (sessions: Session[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    LOCAL_SESSION_KEY,
    JSON.stringify(
      sessions.map((session) => ({
        ...session,
        createdAt: session.createdAt.toISOString(),
        solves: session.solves.map((solve) => ({
          ...solve,
          timestamp: solve.timestamp.toISOString(),
        })),
      }))
    )
  );
};

const createLocalSessionObject = (name: string, puzzleType: PuzzleType): Session => ({
  id: getAnonymousId('anon-session'),
  name,
  puzzleType,
  createdAt: new Date(),
  solves: [],
});

const createLocalSolveObject = (solveData: Omit<Solve, 'id' | 'timestamp'>): Solve => ({
  id: getAnonymousId('anon-solve'),
  ...solveData,
  timestamp: new Date(),
});

const getDefaultLocalSessions = (): Session[] => {
  const defaultId = getAnonymousId('anon-default-session');
  const playgroundId = getAnonymousId('anon-playground-session');

  return [
    {
      id: defaultId,
      name: 'Default Session',
      puzzleType: '3x3',
      createdAt: new Date(),
      solves: [],
    },
    {
      id: playgroundId,
      name: 'Playground',
      puzzleType: '3x3',
      createdAt: new Date(),
      solves: [],
    },
  ];
};

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
  storageMode: StorageMode;
  
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
  storageMode: 'api',
  
  loadSessions: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/sessions');

      if (response.status === 401) {
        const localSessions = loadLocalSessionsFromStorage();

        const sessionsToUse = localSessions.length > 0 ? localSessions : getDefaultLocalSessions();
        if (sessionsToUse.length > 0) {
          saveLocalSessionsToStorage(sessionsToUse);
        }

        set({
          sessions: sessionsToUse,
          currentSessionId: sessionsToUse[0]?.id || null,
          isLoading: false,
          storageMode: 'local',
        });
        return;
      }

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
      
      set({ sessions: transformedSessions, currentSessionId: transformedSessions[0]?.id || null, isLoading: false, storageMode: 'api' });
    } catch (error) {
      console.error('Error loading sessions, falling back to local sessions:', error);
      const localSessions = loadLocalSessionsFromStorage();
      const sessionsToUse = localSessions.length > 0 ? localSessions : getDefaultLocalSessions();
      saveLocalSessionsToStorage(sessionsToUse);
      set({
        sessions: sessionsToUse,
        currentSessionId: sessionsToUse[0]?.id || null,
        isLoading: false,
        storageMode: 'local',
      });
      toast.error('Failed to load sessions from server, using guest timer mode');
    }
  },
  
  createSession: async (name, puzzleType) => {
    set({ isLoading: true });
    try {
      const state = get();
      if (state.storageMode === 'local') {
        const newSession = createLocalSessionObject(name, puzzleType);
        set((currentState) => {
          const nextSessions = [...currentState.sessions, newSession];
          saveLocalSessionsToStorage(nextSessions);
          return {
            sessions: nextSessions,
            currentSessionId: newSession.id,
            isLoading: false,
            storageMode: 'local',
          };
        });
        toast.success(`Session "${name}" created successfully`);
        return;
      }

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, puzzleType }),
      });

      if (response.status === 401) {
        const newSession = createLocalSessionObject(name, puzzleType);
        set((currentState) => {
          const nextSessions = [...currentState.sessions, newSession];
          saveLocalSessionsToStorage(nextSessions);
          return {
            sessions: nextSessions,
            currentSessionId: newSession.id,
            isLoading: false,
            storageMode: 'local',
          };
        });
        toast.success(`Session "${name}" created locally`);
        return;
      }

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
      console.error('Error creating session, falling back to local mode:', error);
      const newSession = createLocalSessionObject(name, puzzleType);
      set((currentState) => {
        const nextSessions = [...currentState.sessions, newSession];
        saveLocalSessionsToStorage(nextSessions);
        return {
          sessions: nextSessions,
          currentSessionId: newSession.id,
          isLoading: false,
          storageMode: 'local',
        };
      });
      toast.success(`Session "${name}" created locally`);
    }
  },
  
  updateSession: async (id, updates) => {
    set({ isLoading: true });
    try {
      const state = get();
      if (state.storageMode === 'local') {
        set((currentState) => {
          const nextSessions = currentState.sessions.map(session =>
            session.id === id ? { ...session, ...updates } : session
          );
          saveLocalSessionsToStorage(nextSessions);
          return {
            sessions: nextSessions,
            isLoading: false,
          };
        });
        toast.success('Session updated successfully');
        return;
      }

      const response = await fetch(`/api/sessions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.status === 401) {
        set((currentState) => {
          const nextSessions = currentState.sessions.map(session =>
            session.id === id ? { ...session, ...updates } : session
          );
          saveLocalSessionsToStorage(nextSessions);
          return {
            sessions: nextSessions,
            isLoading: false,
            storageMode: 'local',
          };
        });
        toast.success('Session updated locally');
        return;
      }

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
      const state = get();
      if (state.storageMode === 'local') {
        const sessionToDelete = state.sessions.find(s => s.id === id);
        set((currentState) => {
          const updatedSessions = currentState.sessions.filter(session => session.id !== id);
          saveLocalSessionsToStorage(updatedSessions);
          return {
            sessions: updatedSessions,
            currentSessionId: currentState.currentSessionId === id ? null : currentState.currentSessionId,
            isLoading: false,
          };
        });
        if (sessionToDelete) {
          toast.success(`Session "${sessionToDelete.name}" deleted`);
        }
        return;
      }

      const response = await fetch(`/api/sessions/${id}`, {
        method: 'DELETE',
      });

      if (response.status === 401) {
        const sessionToDelete = state.sessions.find(s => s.id === id);
        set((currentState) => {
          const updatedSessions = currentState.sessions.filter(session => session.id !== id);
          saveLocalSessionsToStorage(updatedSessions);
          return {
            sessions: updatedSessions,
            currentSessionId: currentState.currentSessionId === id ? null : currentState.currentSessionId,
            isLoading: false,
            storageMode: 'local',
          };
        });
        if (sessionToDelete) {
          toast.success(`Session "${sessionToDelete.name}" deleted locally`);
        }
        return;
      }

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
      const state = get();
      if (state.storageMode === 'local') {
        const newSolve = createLocalSolveObject(solveData);
        set((currentState) => {
          const nextSessions = currentState.sessions.map(session =>
            session.id === solveData.sessionId
              ? { ...session, solves: [...session.solves, newSolve] }
              : session
          );
          saveLocalSessionsToStorage(nextSessions);
          return {
            sessions: nextSessions,
            isLoading: false,
          };
        });

        const timeStr = formatTime(newSolve.time + (newSolve.penalty === '+2' ? 2000 : 0));
        toast.success(`Solve recorded: ${timeStr}`);
        return;
      }

      const response = await fetch('/api/solves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(solveData),
      });

      if (response.status === 401) {
        const newSolve = createLocalSolveObject(solveData);
        set((currentState) => {
          const nextSessions = currentState.sessions.map(session =>
            session.id === solveData.sessionId
              ? { ...session, solves: [...session.solves, newSolve] }
              : session
          );
          saveLocalSessionsToStorage(nextSessions);
          return {
            sessions: nextSessions,
            isLoading: false,
            storageMode: 'local',
          };
        });

        const timeStr = formatTime(newSolve.time + (newSolve.penalty === '+2' ? 2000 : 0));
        toast.success(`Solve recorded: ${timeStr}`);
        return;
      }

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
      console.error('Error adding solve, falling back to local save:', error);
      const state = get();
      const sessionId = solveData.sessionId || state.currentSessionId;
      if (sessionId) {
        const newSolve = createLocalSolveObject(solveData);
        set((currentState) => {
          const nextSessions = currentState.sessions.map(session =>
            session.id === sessionId
              ? { ...session, solves: [...session.solves, newSolve] }
              : session
          );
          saveLocalSessionsToStorage(nextSessions);
          return {
            sessions: nextSessions,
            isLoading: false,
            storageMode: 'local',
          };
        });
        const timeStr = formatTime(newSolve.time + (newSolve.penalty === '+2' ? 2000 : 0));
        toast.success(`Solve recorded: ${timeStr}`);
        return;
      }
      set({ isLoading: false });
      toast.error('Failed to record solve');
    }
  },
  
  updateSolve: async (solveId, updates) => {
    set({ isLoading: true });
    try {
      const state = get();
      if (state.storageMode === 'local') {
        set((currentState) => {
          const nextSessions = currentState.sessions.map(session => ({
            ...session,
            solves: session.solves.map(solve =>
              solve.id === solveId ? { ...solve, ...updates } : solve
            ),
          }));
          saveLocalSessionsToStorage(nextSessions);
          return {
            sessions: nextSessions,
            isLoading: false,
          };
        });
        toast.success('Solve updated successfully');
        return;
      }

      const requestBody = {
        ...updates,
        penalty: updates.penalty === undefined ? null : updates.penalty,
      };

      const response = await fetch(`/api/solves/${solveId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 401) {
        set((currentState) => {
          const nextSessions = currentState.sessions.map(session => ({
            ...session,
            solves: session.solves.map(solve =>
              solve.id === solveId ? { ...solve, ...updates } : solve
            ),
          }));
          saveLocalSessionsToStorage(nextSessions);
          return {
            sessions: nextSessions,
            isLoading: false,
            storageMode: 'local',
          };
        });
        toast.success('Solve updated locally');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to update solve');
      }

      const updatedSolve = await response.json();
      const normalizedSolve = {
        ...updatedSolve,
        penalty: updatedSolve.penalty as 'DNF' | '+2' | undefined,
        timestamp: new Date(updatedSolve.timestamp),
      };

      set((state) => ({
        sessions: state.sessions.map(session => ({
          ...session,
          solves: session.solves.map(solve =>
            solve.id === solveId ? normalizedSolve : solve
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
      const state = get();
      if (state.storageMode === 'local') {
        set((currentState) => {
          const nextSessions = currentState.sessions.map(session => ({
            ...session,
            solves: session.solves.filter(solve => solve.id !== solveId),
          }));
          saveLocalSessionsToStorage(nextSessions);
          return {
            sessions: nextSessions,
            isLoading: false,
          };
        });
        toast.success('Solve deleted successfully');
        return;
      }

      const response = await fetch(`/api/solves/${solveId}`, {
        method: 'DELETE',
      });

      if (response.status === 401) {
        set((currentState) => {
          const nextSessions = currentState.sessions.map(session => ({
            ...session,
            solves: session.solves.filter(solve => solve.id !== solveId),
          }));
          saveLocalSessionsToStorage(nextSessions);
          return {
            sessions: nextSessions,
            isLoading: false,
            storageMode: 'local',
          };
        });
        toast.success('Solve deleted locally');
        return;
      }

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