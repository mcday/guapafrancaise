import { useState, useCallback } from 'react'
import { createAIProvider } from '@/services/ai/provider-factory'
import type { OralScenarioParams, OralConversationParams, OralEvaluationParams } from '@/services/ai/types'
import type { OralScenario, OralEvaluation } from '@/types/oral'

interface UseOralAIReturn {
  loading: boolean
  error: string | null
  generateScenario: (params: OralScenarioParams) => Promise<OralScenario | null>
  getAIResponse: (params: OralConversationParams) => Promise<string | null>
  evaluatePerformance: (params: OralEvaluationParams) => Promise<OralEvaluation | null>
  clearError: () => void
}

export function useOralAI(): UseOralAIReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateScenario = useCallback(async (params: OralScenarioParams) => {
    setLoading(true)
    setError(null)
    try {
      const provider = createAIProvider()
      return await provider.generateOralScenario(params)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération du scénario')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getAIResponse = useCallback(async (params: OralConversationParams) => {
    setError(null)
    try {
      const provider = createAIProvider()
      return await provider.getOralResponse(params)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la réponse IA')
      return null
    }
  }, [])

  const evaluatePerformance = useCallback(async (params: OralEvaluationParams) => {
    setLoading(true)
    setError(null)
    try {
      const provider = createAIProvider()
      return await provider.evaluateOral(params)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'évaluation')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { loading, error, generateScenario, getAIResponse, evaluatePerformance, clearError }
}
