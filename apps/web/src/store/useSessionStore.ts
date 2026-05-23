import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionStore {
  hasSession: boolean;
  teacherName: string;
  setSession: (status: boolean, name?: string) => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      hasSession: false,
      teacherName: 'John Doe',
      setSession: (status, name) => set((state) => ({ 
        hasSession: status,
        teacherName: name !== undefined ? name : state.teacherName
      })),
    }),
    {
      name: 'vedaai-session-storage',
    }
  )
);
