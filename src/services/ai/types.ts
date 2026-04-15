import type { DicteeContent, TEFAQTopic, DifficultyLevel } from '@/types/dictee'
import type { ComprehensionQuestion, TEFAQSection } from '@/types/comprehension'

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

export interface AIProvider {
  generateDictee(params: DicteeParams): Promise<DicteeContent>
  generateComprehensionQuestions(params: ComprehensionParams): Promise<ComprehensionQuestion[]>
}
