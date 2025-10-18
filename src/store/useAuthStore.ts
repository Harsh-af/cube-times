import { create } from 'zustand';
import { AuthState } from '@/types';
import { saveAuthData, loadAuthData } from '@/lib/storage';
import { toast } from 'sonner';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loadAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  
  login: async (email) => {
    // Placeholder for future Neon DB integration
    // For now, just simulate a successful login
    const user = {
      id: crypto.randomUUID(),
      email,
      name: email.split('@')[0],
    };
    
    set({ isAuthenticated: true, user });
    saveAuthData({ isAuthenticated: true, user });
    toast.success(`Welcome back, ${user.name}!`);
  },
  
  signup: async (email, password, name) => {
    // Placeholder for future Neon DB integration
    // For now, just simulate a successful signup
    const user = {
      id: crypto.randomUUID(),
      email,
      name,
    };
    
    set({ isAuthenticated: true, user });
    saveAuthData({ isAuthenticated: true, user });
    toast.success(`Welcome to Cube Timer, ${name}!`);
  },
  
  logout: () => {
    set({ isAuthenticated: false, user: null });
    saveAuthData({ isAuthenticated: false, user: null });
    toast.success('Logged out successfully');
  },
  
  loadAuth: () => {
    const authData = loadAuthData();
    if (authData) {
      set(authData);
    }
  },
}));
