import type { DifficultyLevel } from './dictee'

export interface Level {
  id: number
  name: string
  nameEs: string
  minXP: number
  maxXP: number
  cefr: DifficultyLevel
}

export type BadgeCategory = 'streak' | 'accuracy' | 'volume' | 'special'

export type BadgeCondition =
  | { type: 'streak'; days: number }
  | { type: 'total_exercises'; count: number }
  | { type: 'dictee_accuracy'; percentage: number; minExercises: number }
  | { type: 'comprehension_accuracy'; percentage: number; minExercises: number }
  | { type: 'total_xp'; amount: number }
  | { type: 'level_reached'; level: number }
  | { type: 'perfect_dictee'; count: number }
  | { type: 'accompanied_mode'; count: number }

export interface Badge {
  id: string
  name: string
  nameEs: string
  description: string
  descriptionEs: string
  icon: string
  category: BadgeCategory
  condition: BadgeCondition
}
