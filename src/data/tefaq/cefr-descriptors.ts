/**
 * CEFR Oral Production Descriptors — per difficulty level
 * For calibrating AI examiner behavior and evaluation expectations
 */

export interface CEFRDescriptor {
  level: string
  speakingBehaviors: string[]
  sectionAExpectations: string
  sectionBExpectations: string
  keyIndicators: string[]
}

export const CEFR_ORAL_DESCRIPTORS: CEFRDescriptor[] = [
  {
    level: 'A2',
    speakingBehaviors: [
      'Réponses très courtes et fragmentaires',
      'Limité aux phrases mémorisées',
      'Longs silences fréquents',
      'Difficultés de compréhension nécessitant des répétitions',
    ],
    sectionAExpectations: 'Moins de 5 questions très basiques. Aucune demande de précision.',
    sectionBExpectations: 'Ne peut pas soutenir l\'argumentation plus de 3-4 minutes. Arrêt rapide.',
    keyIndicators: ['phrases_fixes', 'silences_longs', 'comprehension_limitee'],
  },
  {
    level: 'B1',
    speakingBehaviors: [
      'Communication possible sur sujets familiers mais avec effort visible',
      'Connecteurs basiques corrects (et, mais, parce que, alors, donc)',
      'Vocabulaire adéquat mais limité — mêmes mots répétés',
      'Grammaire : présent, passé composé, futur — évite les structures complexes',
      'Subjonctif absent ou incorrect',
      'Discours généralement compréhensible mais pas fluide',
    ],
    sectionAExpectations: '6-8 questions, surtout basiques. Quelques suivis manqués.',
    sectionBExpectations: 'Peut argumenter mais bloque quand les objections arrivent. Répète les mêmes arguments. Faible variété.',
    keyIndicators: ['connecteurs_basiques', 'vocabulaire_repete', 'subjonctif_absent', 'effort_visible'],
  },
  {
    level: 'B2',
    speakingBehaviors: [
      'Idées reliées fluidement avec des marqueurs discursifs variés (d\'abord, par ailleurs, en revanche, cependant, néanmoins)',
      'Gestion des objections avec le schéma concession + contre-argument sans hésitation',
      'Vocabulaire varié — utilise des synonymes, évite la répétition',
      'Subjonctif utilisé correctement en parole naturelle (bien que, à condition que, pour que)',
      'Auto-correction fluide quand des erreurs surviennent',
      'Registre systématiquement approprié',
      'Prononciation claire, intonation naturelle',
      'Spontanéité visible — réagit à ce que dit l\'examinateur',
    ],
    sectionAExpectations: '9-12 questions variées couvrant toutes les catégories majeures. Demandes de suivi et clarification.',
    sectionBExpectations: 'Soutient les 10 minutes complètes avec énergie. Au moins 4-5 arguments variés. S\'adapte à chaque objection. Propose des compromis.',
    keyIndicators: [
      'connecteurs_varies', 'concession_contre_argument', 'subjonctif_correct',
      'vocabulaire_varie', 'auto_correction', 'registre_adapte', 'spontaneite',
    ],
  },
  {
    level: 'C1',
    speakingBehaviors: [
      'Débit naturel quasi-natif avec auto-correction minimale',
      'Vocabulaire riche et précis incluant des expressions idiomatiques',
      'Structures de phrases complexes utilisées automatiquement',
      'Stratégies de persuasion au-delà de l\'argument (récit, appel émotionnel, humour)',
      'Changements de registre fluides si approprié',
      'Gère les tournants inattendus de la conversation sans perdre son sang-froid',
      'Discours organisé et cohérent même en improvisant',
    ],
    sectionAExpectations: 'Questions précises et nuancées. Reformulations élégantes. Couverture exhaustive.',
    sectionBExpectations: 'Argumentation riche et sophistiquée. Stratégies variées de persuasion. Maîtrise totale de l\'échange.',
    keyIndicators: [
      'debit_natif', 'expressions_idiomatiques', 'structures_complexes_auto',
      'persuasion_variee', 'registre_fluide', 'improvisation',
    ],
  },
]

/** For prompt injection */
export function getCEFRPromptText(targetLevel: string): string {
  const descriptor = CEFR_ORAL_DESCRIPTORS.find((d) => d.level === targetLevel)
  if (!descriptor) return ''
  return [
    `Niveau CECRL ${descriptor.level} — Comportements attendus à l'oral :`,
    ...descriptor.speakingBehaviors.map((b) => `- ${b}`),
    `\nSection A : ${descriptor.sectionAExpectations}`,
    `Section B : ${descriptor.sectionBExpectations}`,
  ].join('\n')
}
