import type { TEFAQTopic, DifficultyLevel } from './dictee'

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
