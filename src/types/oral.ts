import type { DifficultyLevel, TEFAQTopic } from './dictee'

export type OralSection = 'section_a' | 'section_b'

export type OralExamPhase =
  | 'setup'
  | 'generating'
  | 'preparation'
  | 'speaking'
  | 'evaluating'
  | 'results'

export type SpeechInputMode = 'voice' | 'text'

export interface ConversationTurn {
  role: 'user' | 'ai'
  text: string
  timestamp: number
}

export interface OralScenario {
  id: string
  section: OralSection
  topic: TEFAQTopic
  difficulty: DifficultyLevel
  situationFr: string
  situationEs?: string
  roleAI: string
  roleUser: string
  objectivesFr: string[]
  objectivesEs?: string[]
  /** Section B only — the opinion/persuasion prompt */
  opinionPromptFr?: string
  opinionPromptEs?: string
  /** AI's opening line to start the conversation */
  openingLineFr: string
  prepTimeSeconds: number
  speakingTimeSeconds: number
  maxTurns?: number
}

export interface RubricScore {
  criterionId: string
  criterionNameFr: string
  criterionNameEs?: string
  score: number        // 0-5
  maxScore: number     // always 5
  feedbackFr: string
  feedbackEs?: string
  exampleBetterFr?: string
}

export interface OralEvaluation {
  overallScore: number       // 0-100
  tefaqEquivalent: number    // 0-20 (simplified score)
  cefrEstimate: string       // 'A2' | 'B1' | 'B2' | 'C1'
  rubricScores: RubricScore[]
  strengthsFr: string[]
  strengthsEs?: string[]
  weaknessesFr: string[]
  weaknessesEs?: string[]
  improvementTipsFr: string[]
  improvementTipsEs?: string[]
  correctedTranscriptFr?: string
}
