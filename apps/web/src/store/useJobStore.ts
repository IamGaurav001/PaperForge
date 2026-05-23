import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface JobStore {
  recentJobs: string[];
  addJob: (jobId: string) => void;
  removeJob: (jobId: string) => void;
  clearJobs: () => void;
}

export const useJobStore = create<JobStore>()(
  persist(
    (set) => ({
      recentJobs: [],
      addJob: (jobId) => set((state) => ({ 
        recentJobs: [jobId, ...state.recentJobs.filter(id => id !== jobId)].slice(0, 10) 
      })),
      removeJob: (jobId) => set((state) => ({
        recentJobs: state.recentJobs.filter(id => id !== jobId)
      })),
      clearJobs: () => set({ recentJobs: [] }),
    }),
    {
      name: 'vedaai-jobs-storage',
    }
  )
);
