import type { AIProvider } from './types'
import { ClaudeProvider } from './claude-provider'
import { GeminiProvider } from './gemini-provider'
import { useSettingsStore } from '@/stores/useSettingsStore'

export function createAIProvider(): AIProvider {
  const settings = useSettingsStore.getState()

  if (settings.aiProvider === 'claude') {
    if (!settings.claudeApiKey) {
      throw new Error('Clé API Claude manquante. Configure-la dans les réglages.')
    }
    return new ClaudeProvider(settings.claudeApiKey, settings.claudeModel)
  }

  if (!settings.geminiApiKey) {
    throw new Error('Clé API Gemini manquante. Configure-la dans les réglages.')
  }
  return new GeminiProvider(settings.geminiApiKey, settings.geminiModel)
}
