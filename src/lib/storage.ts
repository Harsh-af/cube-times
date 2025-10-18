import { Session } from '@/types';

const STORAGE_KEYS = {
  SESSIONS: 'cube-timer-sessions',
  CURRENT_SESSION: 'cube-timer-current-session',
  AUTH: 'cube-timer-auth',
} as const;

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
}

export function saveSessions(sessions: Session[]): void {
  // Convert dates to strings for JSON serialization
  const serializedSessions = sessions.map(session => ({
    ...session,
    createdAt: session.createdAt.toISOString(),
    solves: session.solves.map(solve => ({
      ...solve,
      timestamp: solve.timestamp.toISOString(),
    })),
  }));
  saveToStorage(STORAGE_KEYS.SESSIONS, serializedSessions);
}

export function loadSessions(): Session[] {
  const serializedSessions = loadFromStorage(STORAGE_KEYS.SESSIONS, []);
  return serializedSessions.map(session => ({
    ...session,
    createdAt: new Date(session.createdAt),
    solves: session.solves.map(solve => ({
      ...solve,
      timestamp: new Date(solve.timestamp),
    })),
  }));
}

export function saveCurrentSessionId(sessionId: string): void {
  saveToStorage(STORAGE_KEYS.CURRENT_SESSION, sessionId);
}

export function loadCurrentSessionId(): string | null {
  return loadFromStorage(STORAGE_KEYS.CURRENT_SESSION, null);
}

export function saveAuthData(authData: unknown): void {
  saveToStorage(STORAGE_KEYS.AUTH, authData);
}

export function loadAuthData(): unknown {
  return loadFromStorage(STORAGE_KEYS.AUTH, null);
}

export function clearStorage(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
