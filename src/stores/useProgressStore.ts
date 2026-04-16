import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LEVELS } from '@/lib/constants'
import type { Level } from '@/types/progress'
import { format, isYesterday, parseISO, isToday } from 'date-fns'

function calculateLevel(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i]
  }
  return LEVELS[0]
}

interface ProgressState {
  totalXP: number
  currentLevel: Level
  currentStreak: number
  longestStreak: number
  lastExerciseDate: string | null
  unlockedBadges: string[]
  newBadgeIds: string[]
  totalExercises: number
  totalDictees: number
  totalComprehension: number
  totalOral: number
  totalAccompanied: number
  perfectDictees: number
  averageDicteeScore: number
  averageComprehensionScore: number
  averageOralScore: number
  dicteeScoreSum: number
  comprehensionScoreSum: number
  oralScoreSum: number

  addXP: (amount: number) => void
  updateStreak: () => void
  unlockBadge: (badgeId: string) => void
  markBadgeSeen: (badgeId: string) => void
  recordExercise: (type: 'dictee' | 'comprehension' | 'oral', score: number, mode?: 'solo' | 'accompanied') => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      totalXP: 0,
      currentLevel: LEVELS[0],
      currentStreak: 0,
      longestStreak: 0,
      lastExerciseDate: null,
      unlockedBadges: [],
      newBadgeIds: [],
      totalExercises: 0,
      totalDictees: 0,
      totalComprehension: 0,
      totalOral: 0,
      totalAccompanied: 0,
      perfectDictees: 0,
      averageDicteeScore: 0,
      averageComprehensionScore: 0,
      averageOralScore: 0,
      dicteeScoreSum: 0,
      comprehensionScoreSum: 0,
      oralScoreSum: 0,

      addXP: (amount) =>
        set((state) => {
          const newXP = state.totalXP + amount
          return { totalXP: newXP, currentLevel: calculateLevel(newXP) }
        }),

      updateStreak: () =>
        set((state) => {
          const today = format(new Date(), 'yyyy-MM-dd')
          if (state.lastExerciseDate && isToday(parseISO(state.lastExerciseDate))) {
            return state
          }
          const wasYesterday = state.lastExerciseDate
            ? isYesterday(parseISO(state.lastExerciseDate))
            : false
          const newStreak = wasYesterday ? state.currentStreak + 1 : 1
          return {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, state.longestStreak),
            lastExerciseDate: today,
          }
        }),

      unlockBadge: (badgeId) =>
        set((state) => {
          if (state.unlockedBadges.includes(badgeId)) return state
          return {
            unlockedBadges: [...state.unlockedBadges, badgeId],
            newBadgeIds: [...state.newBadgeIds, badgeId],
          }
        }),

      markBadgeSeen: (badgeId) =>
        set((state) => ({
          newBadgeIds: state.newBadgeIds.filter((id) => id !== badgeId),
        })),

      recordExercise: (type, score, mode = 'solo') =>
        set((state) => {
          const updates: Partial<ProgressState> = {
            totalExercises: state.totalExercises + 1,
          }
          if (type === 'dictee') {
            const newSum = state.dicteeScoreSum + score
            const newCount = state.totalDictees + 1
            updates.totalDictees = newCount
            updates.dicteeScoreSum = newSum
            updates.averageDicteeScore = Math.round(newSum / newCount)
            if (score === 100) updates.perfectDictees = state.perfectDictees + 1
          } else if (type === 'oral') {
            const newSum = state.oralScoreSum + score
            const newCount = state.totalOral + 1
            updates.totalOral = newCount
            updates.oralScoreSum = newSum
            updates.averageOralScore = Math.round(newSum / newCount)
          } else {
            const newSum = state.comprehensionScoreSum + score
            const newCount = state.totalComprehension + 1
            updates.totalComprehension = newCount
            updates.comprehensionScoreSum = newSum
            updates.averageComprehensionScore = Math.round(newSum / newCount)
          }
          if (mode === 'accompanied') {
            updates.totalAccompanied = state.totalAccompanied + 1
          }
          return updates as ProgressState
        }),
    }),
    {
      name: 'tefaq-progress',
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>
        if (version < 2) {
          state.totalOral = 0
          state.oralScoreSum = 0
          state.averageOralScore = 0
        }
        return state as unknown as ProgressState
      },
    }
  )
)
