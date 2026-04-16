import type { DiffStats } from '@/types/dictee'
import type { DifficultyLevel } from '@/types/dictee'
import { XP_RULES } from '@/lib/constants'

export interface ScoreBreakdown {
  baseXP: number
  accuracyBonus: number
  perfectBonus: number
  dailyBonus: number
  streakBonus: number
  accompaniedBonus: number
  totalXP: number
}

export function calculateDicteeXP(
  stats: DiffStats,
  difficulty: DifficultyLevel,
  options: {
    isFirstToday?: boolean
    currentStreak?: number
    isAccompanied?: boolean
  } = {}
): ScoreBreakdown {
  const baseXP = XP_RULES.dicteeBase[difficulty]

  // Accuracy bonus: +5 per 10% above 60%
  const accuracyAbove60 = Math.max(0, stats.accuracy - 60)
  const accuracyBonus = Math.floor(accuracyAbove60 / 10) * XP_RULES.dicteeAccuracyBonus

  const perfectBonus = stats.accuracy === 100 ? XP_RULES.perfectDicteeBonus : 0
  const dailyBonus = options.isFirstToday ? XP_RULES.dailyFirstBonus : 0
  const streakBonus = options.currentStreak
    ? Math.floor(options.currentStreak / 5) * XP_RULES.streakBonus
    : 0
  const accompaniedBonus = options.isAccompanied ? XP_RULES.accompaniedBonus : 0

  return {
    baseXP,
    accuracyBonus,
    perfectBonus,
    dailyBonus,
    streakBonus,
    accompaniedBonus,
    totalXP: baseXP + accuracyBonus + perfectBonus + dailyBonus + streakBonus + accompaniedBonus,
  }
}

export function calculateComprehensionXP(
  correctCount: number,
  totalCount: number,
  difficulty: DifficultyLevel
): number {
  const baseXP = XP_RULES.comprehensionBase[difficulty]
  const percentage = totalCount > 0 ? (correctCount / totalCount) * 100 : 0
  const above50 = Math.max(0, percentage - 50)
  const bonus = Math.floor(above50 / 20) * XP_RULES.comprehensionCorrectBonus
  return baseXP + bonus
}

export function calculateOralXP(
  score: number, // 0-100
  difficulty: DifficultyLevel
): number {
  const baseXP = XP_RULES.oralBase[difficulty]
  const above40 = Math.max(0, score - 40)
  const accuracyBonus = Math.floor(above40 / 10) * XP_RULES.oralAccuracyBonus
  return baseXP + accuracyBonus
}
