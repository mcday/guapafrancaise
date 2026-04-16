/**
 * TEFAQ Expression Orale — Official Evaluation Rubrics
 * Source: CCI Paris Île-de-France (October 2024), ATF Montréal examiners
 */

export interface RubricCriterion {
  id: string
  nameFr: string
  nameEs: string
  pillar: 'discourse' | 'language'
  section: 'a' | 'b' | 'both'
  descriptors: Record<string, string> // CEFR level → description
}

export const RUBRIC_CRITERIA: RubricCriterion[] = [
  {
    id: 'criterion_1a',
    nameFr: 'Qualité du discours — Capacité à obtenir des informations',
    nameEs: 'Calidad del discurso — Capacidad para obtener información',
    pillar: 'discourse',
    section: 'a',
    descriptors: {
      'A1-A2': 'Questions très limitées, fragmentaires. Moins de 5 questions basiques. Aucune demande de précision.',
      'B1': '6-8 questions pertinentes mais basiques. Peu de suivi après les réponses. Quelques catégories couvertes.',
      'B2': '9-12 questions variées couvrant toutes les catégories. Demandes de clarification spontanées. Suivi naturel des réponses.',
      'C1': 'Questions précises et nuancées. Reformulations élégantes. Couverture exhaustive et approfondie du sujet.',
    },
  },
  {
    id: 'criterion_1b',
    nameFr: 'Qualité du discours — Efficacité de l\'argumentation',
    nameEs: 'Calidad del discurso — Eficacia de la argumentación',
    pillar: 'discourse',
    section: 'b',
    descriptors: {
      'A1-A2': 'Arguments très courts et répétitifs. Capitulation face aux objections. Pas de présentation du document.',
      'B1': '2-3 arguments basiques. Difficulté à gérer les objections. Peu de variété dans la persuasion.',
      'B2': '4-5 arguments variés et spécifiques au document. Schéma concession + contre-argument. Propositions de compromis.',
      'C1': 'Argumentation riche avec stratégies variées (récit, émotion, humour). Contre-arguments spontanés et créatifs.',
    },
  },
  {
    id: 'criterion_2a',
    nameFr: 'Le lexique (vocabulaire)',
    nameEs: 'El léxico (vocabulario)',
    pillar: 'language',
    section: 'both',
    descriptors: {
      'A1-A2': 'Vocabulaire très limité. Mots basiques répétés. Erreurs fréquentes de registre.',
      'B1': 'Vocabulaire adéquat mais limité. Mêmes mots répétés. Registre généralement correct.',
      'B2': 'Vocabulaire varié et précis. Synonymes utilisés. Registre adapté (vous/tu) tout au long.',
      'C1': 'Vocabulaire riche, nuancé et idiomatique. Expressions recherchées. Registre parfaitement maîtrisé.',
    },
  },
  {
    id: 'criterion_2b',
    nameFr: 'La syntaxe (grammaire et structures)',
    nameEs: 'La sintaxis (gramática y estructuras)',
    pillar: 'language',
    section: 'both',
    descriptors: {
      'A1-A2': 'Phrases simples uniquement. Erreurs fréquentes de conjugaison et d\'accord.',
      'B1': 'Phrases composées basiques. Connecteurs simples (et, mais, parce que). Peu de structures complexes.',
      'B2': 'Structures variées incluant le subjonctif. Connecteurs adversatifs et concessifs. Auto-correction fluide.',
      'C1': 'Structures complexes automatiques. Subjonctif naturel. Phrases imbriquées maîtrisées.',
    },
  },
  {
    id: 'criterion_2c',
    nameFr: 'L\'aisance à l\'oral (fluidité et prononciation)',
    nameEs: 'La fluidez oral (fluidez y pronunciación)',
    pillar: 'language',
    section: 'both',
    descriptors: {
      'A1-A2': 'Pauses longues et fréquentes. Prononciation difficile à comprendre. Débit très lent.',
      'B1': 'Hésitations visibles mais discours généralement compréhensible. Débit acceptable.',
      'B2': 'Discours fluide avec peu d\'hésitations. Prononciation claire. Intonation naturelle.',
      'C1': 'Débit naturel quasi-natif. Auto-correction imperceptible. Intonation expressive et adaptée.',
    },
  },
]

/** The 8 evaluative questions examiners ask themselves (from CCI Paris PDF) */
export const EXAMINER_CHECKLIST_FR = [
  'Le discours est-il adapté à la situation ?',
  'Les idées sont-elles sommairement exprimées, vagues, précises ou détaillées ?',
  'Les réactions aux interventions de l\'examinateur sont-elles adaptées, spontanées, naturelles ?',
  'Le discours est-il clair, lucide, confus ou incohérent ?',
  'Le vocabulaire utilisé est-il exact, précis, adéquat ?',
  'Les phrases sont-elles simples, complexes, maîtrisées ?',
  'Les temps et les modes sont-ils correctement utilisés ?',
  'La prononciation est-elle claire, naturelle ?',
]

/** TEFAQ score to points conversion (0-699 scale) */
export const SCORE_BANDS = {
  'below_A1': { min: 0, max: 99 },
  'A1': { min: 100, max: 199 },
  'A2': { min: 200, max: 299 },
  'B1': { min: 300, max: 399 },
  'B2': { min: 400, max: 499 },
  'C1': { min: 500, max: 599 },
  'C2': { min: 600, max: 699 },
} as const

/** For prompt injection: compact rubric text */
export function getRubricPromptText(): string {
  return RUBRIC_CRITERIA.map(
    (c) =>
      `### ${c.nameFr} (${c.section === 'both' ? 'Sections A & B' : `Section ${c.section.toUpperCase()}`})\n` +
      Object.entries(c.descriptors)
        .map(([level, desc]) => `- ${level}: ${desc}`)
        .join('\n')
  ).join('\n\n')
}
