import { z } from 'zod'
import type { OralScenario, OralEvaluation } from '@/types/oral'
import type { OralSection } from '@/types/oral'
import type { TEFAQTopic, DifficultyLevel } from '@/types/dictee'
import { SECTION_FORMATS } from '@/data/tefaq/exam-format'

function cleanJsonString(raw: string): string {
  return raw
    .replace(/```json?\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()
}

const OralScenarioSchema = z.object({
  situationFr: z.string().min(10),
  situationEs: z.string().optional(),
  roleAI: z.string(),
  roleUser: z.string(),
  objectivesFr: z.array(z.string()).min(1),
  objectivesEs: z.array(z.string()).optional(),
  opinionPromptFr: z.string().optional(),
  opinionPromptEs: z.string().optional(),
  openingLineFr: z.string(),
})

const RubricScoreSchema = z.object({
  criterionId: z.string(),
  criterionNameFr: z.string(),
  criterionNameEs: z.string().optional(),
  score: z.number().min(0).max(5),
  maxScore: z.number().default(5),
  feedbackFr: z.string(),
  feedbackEs: z.string().optional(),
  exampleBetterFr: z.string().optional(),
})

const OralEvaluationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  tefaqEquivalent: z.number().min(0).max(20),
  cefrEstimate: z.string(),
  rubricScores: z.array(RubricScoreSchema).default([]),
  strengthsFr: z.array(z.string()).default([]),
  strengthsEs: z.array(z.string()).optional(),
  weaknessesFr: z.array(z.string()).default([]),
  weaknessesEs: z.array(z.string()).optional(),
  improvementTipsFr: z.array(z.string()).default([]),
  improvementTipsEs: z.array(z.string()).optional(),
  correctedTranscriptFr: z.string().optional(),
})

export function parseOralScenarioResponse(
  raw: string,
  section: OralSection,
  topic: TEFAQTopic,
  difficulty: DifficultyLevel
): OralScenario {
  try {
    const jsonStr = cleanJsonString(raw)
    const parsed = JSON.parse(jsonStr)
    const validated = OralScenarioSchema.parse(parsed)
    const format = SECTION_FORMATS[section === 'section_a' ? 'a' : 'b']

    return {
      id: crypto.randomUUID(),
      section,
      topic,
      difficulty,
      ...validated,
      prepTimeSeconds: format.prepTimeSeconds,
      speakingTimeSeconds: format.durationMinutes * 60,
      maxTurns: format.maxTurns,
    }
  } catch {
    throw new Error('Réponse invalide du modèle IA pour le scénario. Réessaie.')
  }
}

export function parseOralEvaluationResponse(raw: string): OralEvaluation {
  try {
    const jsonStr = cleanJsonString(raw)
    const parsed = JSON.parse(jsonStr)
    return OralEvaluationSchema.parse(parsed)
  } catch {
    throw new Error('Réponse invalide du modèle IA pour l\'évaluation. Réessaie.')
  }
}
