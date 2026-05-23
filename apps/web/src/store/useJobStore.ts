import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface JobData {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  assignedOn: string;
}

interface JobStore {
  recentJobs: JobData[];
  addJob: (job: JobData) => void;
  removeJob: (jobId: string) => void;
  clearJobs: () => void;
}

export const useJobStore = create<JobStore>()(
  persist(
    (set) => ({
      recentJobs: [],
      addJob: (job) => set((state) => ({ 
        recentJobs: [job, ...state.recentJobs.filter(j => j.id !== job.id)].slice(0, 10) 
      })),
      removeJob: (jobId) => set((state) => ({
        recentJobs: state.recentJobs.filter(j => j.id !== jobId)
      })),
      clearJobs: () => set({ recentJobs: [] }),
    }),
    {
      name: 'vedaai-jobs-storage',
    }
  )
);
