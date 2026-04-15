import type { TEFAQTopic, DifficultyLevel, DiffResult, ManualError } from './dictee'
import type { ComprehensionResult } from './comprehension'

export type ExercisePhase =
  | 'setup'
  | 'generating'
  | 'listening'
  | 'writing'
  | 'correcting'
  | 'questions'
  | 'results'

export interface ExerciseRecord {
  id: string
  date: string
  type: 'dictee' | 'comprehension' | 'full'
  mode: 'solo' | 'accompanied'
  topic: TEFAQTopic
  difficulty: DifficultyLevel
  dicteeScore: number | null
  comprehensionScore: number | null
  xpEarned: number
}

export interface ExerciseSession {
  id: string
  startedAt: string
  completedAt?: string
  mode: 'solo' | 'accompanied'
  topic: TEFAQTopic
  difficulty: DifficultyLevel
  dicteeResult?: DiffResult | { manualErrors: ManualError[]; score: number }
  comprehensionResult?: ComprehensionResult
  totalXPEarned: number
  badgesUnlocked: string[]
}
