import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DifficultyLevel } from '@/types/dictee'
import type { AIProviderType } from '@/types/settings'

type TTSProvider = 'cloud' | 'browser'
type AIMode = 'server' | 'browser'

interface SettingsState {
  aiMode: AIMode
  aiProvider: AIProviderType
  claudeApiKey: string
  geminiApiKey: string
  claudeModel: string
  geminiModel: string
  ttsProvider: TTSProvider
  ttsVoiceURI: string
  ttsRate: number
  defaultDifficulty: DifficultyLevel
  showSpanishHints: boolean
  soundEnabled: boolean

  setAiMode: (mode: AIMode) => void
  setAiProvider: (provider: AIProviderType) => void
  setApiKey: (provider: AIProviderType, key: string) => void
  setClaudeModel: (model: string) => void
  setGeminiModel: (model: string) => void
  setTTSProvider: (provider: TTSProvider) => void
  setTTSVoice: (voiceURI: string) => void
  setTTSRate: (rate: number) => void
  setDefaultDifficulty: (level: DifficultyLevel) => void
  toggleSpanishHints: () => void
  toggleSound: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      aiMode: 'server',
      aiProvider: 'claude',
      claudeApiKey: '',
      geminiApiKey: '',
      claudeModel: 'claude-sonnet-4-20250514',
      geminiModel: 'gemini-2.0-flash',
      ttsProvider: 'cloud',
      ttsVoiceURI: '',
      ttsRate: 0.9,
      defaultDifficulty: 'B1',
      showSpanishHints: true,
      soundEnabled: true,

      setAiMode: (mode) => set({ aiMode: mode }),
      setAiProvider: (provider) => set({ aiProvider: provider }),
      setApiKey: (provider, key) =>
        set(provider === 'claude' ? { claudeApiKey: key } : { geminiApiKey: key }),
      setClaudeModel: (model) => set({ claudeModel: model }),
      setGeminiModel: (model) => set({ geminiModel: model }),
      setTTSProvider: (provider) => set({ ttsProvider: provider }),
      setTTSVoice: (voiceURI) => set({ ttsVoiceURI: voiceURI }),
      setTTSRate: (rate) => set({ ttsRate: rate }),
      setDefaultDifficulty: (level) => set({ defaultDifficulty: level }),
      toggleSpanishHints: () => set((s) => ({ showSpanishHints: !s.showSpanishHints })),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
    }),
    {
      name: 'tefaq-settings',
      version: 1,
      partialize: (state) => {
        const { claudeApiKey, geminiApiKey, ...rest } = state
        void claudeApiKey
        void geminiApiKey
        return rest
      },
    }
  )
)
