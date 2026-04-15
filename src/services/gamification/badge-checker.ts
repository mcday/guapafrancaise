import { BADGES } from '@/lib/constants'
import { useProgressStore } from '@/stores/useProgressStore'
import type { Badge } from '@/types/progress'

export function checkNewBadges(): Badge[] {
  const state = useProgressStore.getState()
  const newBadges: Badge[] = []

  for (const badge of BADGES) {
    if (state.unlockedBadges.includes(badge.id)) continue

    let earned = false
    const c = badge.condition

    switch (c.type) {
      case 'streak':
        earned = state.longestStreak >= c.days
        break
      case 'total_exercises':
        earned = state.totalExercises >= c.count
        break
      case 'dictee_accuracy':
        earned = state.totalDictees >= c.minExercises && state.averageDicteeScore >= c.percentage
        break
      case 'comprehension_accuracy':
        earned = state.totalComprehension >= c.minExercises && state.averageComprehensionScore >= c.percentage
        break
      case 'total_xp':
        earned = state.totalXP >= c.amount
        break
      case 'level_reached':
        earned = state.currentLevel.id >= c.level
        break
      case 'perfect_dictee':
        earned = state.perfectDictees >= c.count
        break
      case 'accompanied_mode':
        earned = state.totalAccompanied >= c.count
        break
    }

    if (earned) {
      state.unlockBadge(badge.id)
      newBadges.push(badge)
    }
  }

  return newBadges
}
