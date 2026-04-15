import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ExerciseRecord } from '@/types/exercise'

interface HistoryState {
  exercises: ExerciseRecord[]
  addExercise: (record: ExerciseRecord) => void
  clearHistory: () => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      exercises: [],
      addExercise: (record) =>
        set((state) => ({
          exercises: [record, ...state.exercises].slice(0, 100),
        })),
      clearHistory: () => set({ exercises: [] }),
    }),
    { name: 'tefaq-history', version: 1 }
  )
)
