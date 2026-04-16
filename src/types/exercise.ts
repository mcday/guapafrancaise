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
  type: 'dictee' | 'comprehension' | 'full' | 'oral_a' | 'oral_b'
  mode: 'solo' | 'accompanied'
  topic: TEFAQTopic
  difficulty: DifficultyLevel
  dicteeScore: number | null
  comprehensionScore: number | null
  oralScore: number | null
  xpEarned: number
}
