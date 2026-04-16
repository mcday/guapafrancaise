import type { TEFAQTopic, DifficultyLevel } from '@/types/dictee'
import type { TEFAQSection } from '@/types/comprehension'
import { TOPIC_LABELS } from '@/lib/constants'

const DIFFICULTY_GUIDELINES: Record<DifficultyLevel, string> = {
  A2: 'Phrases simples, vocabulaire quotidien de base, présent et passé composé, peu de subjonctif',
  B1: 'Phrases composées, connecteurs logiques, imparfait, futur, conditionnel présent, vocabulaire varié',
  'B1+': 'Structures complexes, subjonctif présent, discours indirect, vocabulaire soutenu, expressions idiomatiques',
  B2: 'Toutes structures grammaticales, nuances de sens, registres variés, expressions idiomatiques et québécoises, phrases longues avec relatives',
  C1: 'Registre soutenu et littéraire, subjonctif passé et plus-que-parfait, phrases complexes imbriquées, vocabulaire rare et spécialisé, nuances stylistiques fines, expressions québécoises recherchées',
}

const WORD_COUNTS: Record<DifficultyLevel, string> = {
  A2: '40-60',
  B1: '60-90',
  'B1+': '90-130',
  B2: '100-150',
  C1: '150-200',
}

const SECTION_LABELS: Record<TEFAQSection, string> = {
  dialogue: 'dialogue entre deux personnes',
  announcement: 'annonce publique ou message',
  interview: 'entrevue ou reportage',
  short_sentence: 'phrase courte et directe',
}

export function buildDicteePrompt(params: {
  topic: TEFAQTopic
  difficulty: DifficultyLevel
  sentenceCount: number
}): string {
  const topicLabel = TOPIC_LABELS[params.topic].fr
  return `Tu es un professeur de français spécialisé dans la préparation au TEFAQ (Test d'Évaluation de Français Adapté au Québec).

Génère une dictée de ${params.sentenceCount} phrases sur le thème "${topicLabel}" au niveau CECRL ${params.difficulty}.

CONTRAINTES :
- Niveau ${params.difficulty} : ${DIFFICULTY_GUIDELINES[params.difficulty]}
- Utilise du vocabulaire pertinent pour le TEFAQ et la vie au Québec
- Inclus des structures grammaticales typiques du niveau ${params.difficulty}
- Intègre si possible des expressions québécoises courantes
- Les phrases doivent former un texte cohérent (pas des phrases isolées)
- Longueur totale : ${WORD_COUNTS[params.difficulty]} mots

RÉPONSE EN JSON UNIQUEMENT (pas de markdown, pas de commentaires) :
{
  "title": "titre court de la dictée",
  "text": "le texte complet de la dictée avec ponctuation correcte",
  "keyVocabulary": [
    {
      "word": "mot important",
      "definition_fr": "définition en français simple",
      "definition_es": "traducción al español",
      "example": "phrase d'exemple"
    }
  ],
  "grammarPoints": ["point grammatical exercé"],
  "quebecisms": ["expressions québécoises utilisées"]
}`
}

export function buildComprehensionPrompt(params: {
  sourceText: string
  questionCount: number
  difficulty: DifficultyLevel
  section: TEFAQSection
}): string {
  return `Tu es un concepteur d'examens TEFAQ. À partir du texte suivant, crée ${params.questionCount} questions de compréhension orale de type "${SECTION_LABELS[params.section]}" au niveau ${params.difficulty}.

TEXTE SOURCE :
"""
${params.sourceText}
"""

CONTRAINTES :
- Format QCM avec 4 choix de réponse (A, B, C, D)
- Une seule bonne réponse par question
- Les distracteurs doivent être plausibles mais clairement incorrects
- Questions portant sur : le sens général, les détails importants, les intentions, les conséquences
- Niveau de langue des questions : ${params.difficulty}
- Style fidèle au format officiel du TEFAQ

RÉPONSE EN JSON UNIQUEMENT (pas de markdown, pas de commentaires) :
{
  "questions": [
    {
      "id": "q1",
      "type": "${params.section}",
      "questionText": "la question en français",
      "questionTextEs": "la pregunta en español",
      "options": [
        { "id": "a", "text": "option A" },
        { "id": "b", "text": "option B" },
        { "id": "c", "text": "option C" },
        { "id": "d", "text": "option D" }
      ],
      "correctOptionId": "a",
      "explanation": "explication pourquoi c'est la bonne réponse",
      "explanationEs": "explicación en español"
    }
  ]
}`
}
