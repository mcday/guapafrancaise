import type { DifficultyLevel } from './dictee'

export type AIProviderType = 'claude' | 'gemini'

export interface AppSettings {
  aiProvider: AIProviderType
  claudeApiKey: string
  geminiApiKey: string
  claudeModel: string
  geminiModel: string
  ttsVoiceURI: string
  ttsRate: number
  defaultDifficulty: DifficultyLevel
  showSpanishHints: boolean
  soundEnabled: boolean
}
