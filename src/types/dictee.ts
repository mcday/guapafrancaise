export type DifficultyLevel = 'A2' | 'B1' | 'B1+' | 'B2'

export type TEFAQTopic =
  | 'vie_quotidienne'
  | 'travail'
  | 'logement'
  | 'sante'
  | 'education'
  | 'loisirs'
  | 'transports'
  | 'environnement'
  | 'medias'
  | 'culture_quebec'

export interface VocabularyItem {
  word: string
  definition_fr: string
  definition_es: string
  example?: string
}

export interface DicteeContent {
  id: string
  text: string
  title: string
  topic: TEFAQTopic
  difficulty: DifficultyLevel
  wordCount: number
  keyVocabulary: VocabularyItem[]
  grammarPoints: string[]
  quebecisms: string[]
}

export interface DiffChange {
  type: 'equal' | 'added' | 'removed'
  value: string
}

export interface DiffStats {
  totalWords: number
  correctWords: number
  incorrectWords: number
  missingWords: number
  extraWords: number
  accentErrors: number
  accuracy: number
}

export interface DiffResult {
  originalText: string
  userText: string
  changes: DiffChange[]
  stats: DiffStats
}

export interface ManualError {
  wordIndex: number
  originalWord: string
  type: 'wrong' | 'missing' | 'extra' | 'accent'
  note?: string
}
