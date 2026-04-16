import type { DicteeContent, TEFAQTopic, DifficultyLevel } from '@/types/dictee'
import type { ComprehensionQuestion, TEFAQSection } from '@/types/comprehension'
import type { OralSection, OralScenario, ConversationTurn, OralEvaluation } from '@/types/oral'

export interface DicteeParams {
  topic: TEFAQTopic
  difficulty: DifficultyLevel
  sentenceCount?: number
}

export interface ComprehensionParams {
  sourceText: string
  questionCount: number
  difficulty: DifficultyLevel
  section: TEFAQSection
}

export interface OralScenarioParams {
  section: OralSection
  topic: TEFAQTopic
  difficulty: DifficultyLevel
}

export interface OralConversationParams {
  scenario: OralScenario
  turns: ConversationTurn[]
  userLastMessage: string
}

export interface OralEvaluationParams {
  section: OralSection
  scenario: OralScenario
  turns: ConversationTurn[]
}

export interface AIProvider {
  generateDictee(params: DicteeParams): Promise<DicteeContent>
  generateComprehensionQuestions(params: ComprehensionParams): Promise<ComprehensionQuestion[]>
  generateOralScenario(params: OralScenarioParams): Promise<OralScenario>
  getOralResponse(params: OralConversationParams): Promise<string>
  evaluateOral(params: OralEvaluationParams): Promise<OralEvaluation>
}
