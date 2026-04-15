import type { DifficultyLevel } from './dictee'

export type TEFAQSection = 'dialogue' | 'announcement' | 'interview' | 'short_sentence'

export interface AnswerOption {
  id: string
  text: string
}

export interface ComprehensionQuestion {
  id: string
  type: TEFAQSection
  audioContext?: string
  questionText: string
  questionTextEs?: string
  options: AnswerOption[]
  correctOptionId: string
  explanation: string
  explanationEs?: string
  difficulty: DifficultyLevel
}

export interface ComprehensionResult {
  questions: ComprehensionQuestion[]
  userAnswers: Record<string, string>
  score: number
  correctCount: number
  totalCount: number
}
