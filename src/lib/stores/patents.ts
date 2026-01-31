'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Patent, BusinessAnalysis, ProblemHistoryEntry, BusinessAnalysisHistoryEntry } from '@/types';

interface PatentStore {
  savedPatents: Patent[];
  savePatent: (patent: Patent) => void;
  removePatent: (patent: Patent) => void;
  isSaved: (patent: Patent) => boolean;

  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;

  problemHistory: ProblemHistoryEntry[];
  addProblemEntry: (entry: Omit<ProblemHistoryEntry, 'id' | 'date'>) => void;
  deleteProblemEntry: (id: string) => void;
  clearProblemHistory: () => void;

  analysisHistory: BusinessAnalysisHistoryEntry[];
  addAnalysisEntry: (patent: Patent, analysis: BusinessAnalysis) => void;
  deleteAnalysisEntry: (id: string) => void;
  clearAnalysisHistory: () => void;

  clearAllData: () => void;
}

export const usePatentStore = create<PatentStore>()(
  persist(
    (set, get) => ({
      savedPatents: [],
      savePatent: (patent) => set((s) => {
        if (s.savedPatents.some(p => p.id === patent.id)) return s;
        return { savedPatents: [patent, ...s.savedPatents] };
      }),
      removePatent: (patent) => set((s) => ({
        savedPatents: s.savedPatents.filter(p => p.id !== patent.id),
      })),
      isSaved: (patent) => get().savedPatents.some(p => p.id === patent.id),

      apiKey: '',
      setApiKey: (key) => set({ apiKey: key }),
      clearApiKey: () => set({ apiKey: '' }),

      problemHistory: [],
      addProblemEntry: (entry) => set((s) => ({
        problemHistory: [
          { ...entry, id: crypto.randomUUID(), date: new Date().toISOString() },
          ...s.problemHistory,
        ].slice(0, 20),
      })),
      deleteProblemEntry: (id) => set((s) => ({
        problemHistory: s.problemHistory.filter(e => e.id !== id),
      })),
      clearProblemHistory: () => set({ problemHistory: [] }),

      analysisHistory: [],
      addAnalysisEntry: (patent, analysis) => set((s) => ({
        analysisHistory: [
          { id: crypto.randomUUID(), patent, analysis, date: new Date().toISOString() },
          ...s.analysisHistory,
        ].slice(0, 50),
      })),
      deleteAnalysisEntry: (id) => set((s) => ({
        analysisHistory: s.analysisHistory.filter(e => e.id !== id),
      })),
      clearAnalysisHistory: () => set({ analysisHistory: [] }),

      clearAllData: () => set({
        savedPatents: [],
        problemHistory: [],
        analysisHistory: [],
      }),
    }),
    { name: 'patent-radar-store' }
  )
);
