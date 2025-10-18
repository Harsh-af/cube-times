export type PuzzleType = '2x2' | '3x3' | '4x4' | '5x5' | 'pyraminx' | 'megaminx' | 'skewb';

export interface Solve {
  id: string;
  time: number; // milliseconds
  scramble: string;
  puzzleType: PuzzleType;
  sessionId: string;
  timestamp: Date;
  penalty?: 'DNF' | '+2';
}

export interface Session {
  id: string;
  name: string;
  puzzleType: PuzzleType;
  createdAt: Date;
  solves: Solve[];
}

export interface TimerState {
  isRunning: boolean;
  isReady: boolean;
  startTime: number | null;
  currentTime: number;
  lastSolve: Solve | null;
}

export interface Statistics {
  totalSolves: number;
  bestTime: number | null;
  worstTime: number | null;
  mean: number | null;
  median: number | null;
  ao5: number | null;
  ao12: number | null;
  ao100: number | null;
  currentAo5: number | null;
  currentAo12: number | null;
  currentAo100: number | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
}
