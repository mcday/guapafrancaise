import type { AIProvider } from './types'
import { ServerProvider } from './server-provider'
import { ClaudeProvider } from './claude-provider'
import { GeminiProvider } from './gemini-provider'
import { useSettingsStore } from '@/stores/useSettingsStore'

export function createAIProvider(): AIProvider {
  const settings = useSettingsStore.getState()

  // Use server-side proxy (API keys in Netlify env vars)
  if (settings.aiMode === 'server') {
    return new ServerProvider(settings.aiProvider, settings.aiProvider === 'claude' ? settings.claudeModel : settings.geminiModel)
  }

  // Legacy: direct browser calls with user-provided keys
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
