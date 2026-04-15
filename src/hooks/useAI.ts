import { useState, useCallback } from 'react'
import { createAIProvider } from '@/services/ai/provider-factory'
import type { DicteeParams, ComprehensionParams } from '@/services/ai/types'
import type { DicteeContent } from '@/types/dictee'
import type { ComprehensionQuestion } from '@/types/comprehension'

interface UseAIReturn {
  loading: boolean
  error: string | null
  generateDictee: (params: DicteeParams) => Promise<DicteeContent | null>
  generateQuestions: (params: ComprehensionParams) => Promise<ComprehensionQuestion[] | null>
  clearError: () => void
}

export function useAI(): UseAIReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateDictee = useCallback(async (params: DicteeParams) => {
    setLoading(true)
    setError(null)
    try {
      const provider = createAIProvider()
      const result = await provider.generateDictee(params)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la génération'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const generateQuestions = useCallback(async (params: ComprehensionParams) => {
    setLoading(true)
    setError(null)
    try {
      const provider = createAIProvider()
      const result = await provider.generateComprehensionQuestions(params)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la génération'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { loading, error, generateDictee, generateQuestions, clearError }
}
