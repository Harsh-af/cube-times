import { create } from 'zustand';
import { TimerState } from '@/types';

interface TimerStore extends TimerState {
  setRunning: (running: boolean) => void;
  setReady: (ready: boolean) => void;
  setStartTime: (time: number | null) => void;
  setCurrentTime: (time: number) => void;
  setLastSolve: (solve: unknown) => void;
  reset: () => void;
}

export const useTimerStore = create<TimerStore>((set) => ({
  isRunning: false,
  isReady: false,
  startTime: null,
  currentTime: 0,
  lastSolve: null,
  
  setRunning: (running) => set({ isRunning: running }),
  setReady: (ready) => set({ isReady: ready }),
  setStartTime: (time) => set({ startTime: time }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setLastSolve: (solve) => set({ lastSolve: solve }),
  reset: () => set({
    isRunning: false,
    isReady: false,
    startTime: null,
    currentTime: 0,
    lastSolve: null,
  }),
}));
