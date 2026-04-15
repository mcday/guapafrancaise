import { z } from 'zod'
import type { DicteeContent } from '@/types/dictee'
import type { ComprehensionQuestion } from '@/types/comprehension'
import type { DicteeParams, ComprehensionParams } from './types'

const VocabularySchema = z.object({
  word: z.string(),
  definition_fr: z.string(),
  definition_es: z.string(),
  example: z.string().optional(),
})

const DicteeResponseSchema = z.object({
  title: z.string(),
  text: z.string().min(10),
  keyVocabulary: z.array(VocabularySchema).default([]),
  grammarPoints: z.array(z.string()).default([]),
  quebecisms: z.array(z.string()).default([]),
})

const AnswerOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
})

const QuestionSchema = z.object({
  id: z.string(),
  type: z.string().default('dialogue'),
  questionText: z.string(),
  questionTextEs: z.string().optional(),
  options: z.array(AnswerOptionSchema).min(2),
  correctOptionId: z.string(),
  explanation: z.string(),
  explanationEs: z.string().optional(),
})

const ComprehensionResponseSchema = z.object({
  questions: z.array(QuestionSchema),
})

function cleanJsonString(raw: string): string {
  return raw
    .replace(/```json?\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()
}

export function parseDicteeResponse(raw: string, params: DicteeParams): DicteeContent {
  try {
    const jsonStr = cleanJsonString(raw)
    const parsed = JSON.parse(jsonStr)
    const validated = DicteeResponseSchema.parse(parsed)
    return {
      id: crypto.randomUUID(),
      ...validated,
      wordCount: validated.text.split(/\s+/).length,
      difficulty: params.difficulty,
      topic: params.topic,
    }
  } catch {
    throw new Error('Réponse invalide du modèle IA. Réessaie.')
  }
}

export function parseComprehensionResponse(
  raw: string,
  params: ComprehensionParams
): ComprehensionQuestion[] {
  try {
    const jsonStr = cleanJsonString(raw)
    const parsed = JSON.parse(jsonStr)
    const validated = ComprehensionResponseSchema.parse(parsed)
    return validated.questions.map((q) => ({
      ...q,
      type: params.section,
      difficulty: params.difficulty,
    }))
  } catch {
    throw new Error('Réponse invalide du modèle IA. Réessaie.')
  }
}
