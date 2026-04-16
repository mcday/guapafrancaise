/**
 * TEFAQ Expression Orale — Exam Format Rules
 * Timing, turn counts, and rules per section
 */

export interface SectionFormat {
  section: 'a' | 'b'
  nameFr: string
  nameEs: string
  descriptionFr: string
  descriptionEs: string
  durationMinutes: number
  prepTimeSeconds: number
  register: 'formal' | 'informal'
  registerExplanationFr: string
  aiRole: string
  userRole: string
  maxTurns: number
  targetQuestions?: number // Section A only
  rules: string[]
}

export const SECTION_FORMATS: Record<'a' | 'b', SectionFormat> = {
  a: {
    section: 'a',
    nameFr: 'Obtenir des informations',
    nameEs: 'Obtener información',
    descriptionFr: 'Vous simulez un appel téléphonique pour obtenir des informations sur une annonce.',
    descriptionEs: 'Simulas una llamada telefónica para obtener información sobre un anuncio.',
    durationMinutes: 5,
    prepTimeSeconds: 60,
    register: 'formal',
    registerExplanationFr: 'Utilisez le vouvoiement (vous) tout au long. Formulations polies : « Serait-il possible de... ? », « Pourriez-vous... ? »',
    aiRole: 'La personne qui a publié l\'annonce (employeur, propriétaire, organisateur)',
    userRole: 'Une personne intéressée qui appelle pour obtenir des informations',
    maxTurns: 12,
    targetQuestions: 10,
    rules: [
      'Posez environ 10 questions variées',
      'Couvrez toutes les catégories pertinentes (prix, horaire, conditions, etc.)',
      'Demandez des précisions quand les réponses sont vagues',
      'Réagissez naturellement aux réponses — ne lisez pas une liste',
      'Maintenez le vouvoiement du début à la fin',
      'Commencez par une salutation et l\'objet de votre appel',
    ],
  },
  b: {
    section: 'b',
    nameFr: 'Convaincre un(e) ami(e)',
    nameEs: 'Convencer a un(a) amigo(a)',
    descriptionFr: 'Vous présentez une annonce à un(e) ami(e) sceptique et essayez de le/la convaincre.',
    descriptionEs: 'Presentas un anuncio a un(a) amigo(a) escéptico(a) e intentas convencerlo(a).',
    durationMinutes: 10,
    prepTimeSeconds: 60,
    register: 'informal',
    registerExplanationFr: 'Utilisez le tutoiement (tu) tout au long. Registre familier/courant : « Écoute, fais-moi confiance ! », « T\'inquiète pas ! »',
    aiRole: 'Un(e) ami(e) sceptique qui résiste et soulève des objections',
    userRole: 'Vous présentez le document et essayez de convaincre votre ami(e)',
    maxTurns: 16,
    rules: [
      '1. Présentez le document clairement avant d\'argumenter',
      '2. Développez au moins 4-5 arguments variés et spécifiques',
      '3. Quand l\'ami(e) objecte : reconnaissez + contre-argumentez',
      '4. Proposez des compromis et des solutions créatives',
      '5. Maintenez le tutoiement du début à la fin',
      '6. Restez amical(e) et enthousiaste — pas agressif/ve',
      '7. N\'abandonnez jamais — continuez à persuader',
    ],
  },
}

/** The examiner's Section B resistance pattern */
export const EXAMINER_OBJECTION_PATTERN = {
  categories: [
    { type: 'practical', examplesFr: ['Je n\'ai pas le temps.', 'C\'est trop loin.', 'Je ne peux pas le week-end.'] },
    { type: 'financial', examplesFr: ['C\'est trop cher.', 'Je n\'ai pas le budget.', 'Je préfère économiser.'] },
    { type: 'emotional', examplesFr: ['Ça ne m\'intéresse pas vraiment.', 'Je ne me vois pas faire ça.', 'J\'ai peur.'] },
  ],
  behavior: 'L\'examinateur ne dit JAMAIS oui avant la fin. Il cycle entre objections pratiques, financières et émotionnelles.',
}

/** Register error severity */
export const REGISTER_PENALTIES = {
  section_a_tutoiement: 'Pénalité sur Critère 1A + 2A — erreur de registre significative',
  section_b_vouvoiement_systematic: 'Pénalité SÉVÈRE sur Critère 1B + 2A — le vous en Section B « pénalise sévèrement le score »',
  section_b_vouvoiement_slip: 'Pénalité légère mais notée — la constance est attendue',
}

/** For prompt injection: compact format rules */
export function getFormatRulesText(section: 'a' | 'b'): string {
  const format = SECTION_FORMATS[section]
  return [
    `=== SECTION ${section.toUpperCase()} : ${format.nameFr} ===`,
    `Durée : ${format.durationMinutes} minutes | Préparation : ${format.prepTimeSeconds}s`,
    `Registre : ${format.register === 'formal' ? 'FORMEL (vouvoiement)' : 'INFORMEL (tutoiement)'}`,
    `${format.registerExplanationFr}`,
    `Rôle de l'IA : ${format.aiRole}`,
    `Rôle du candidat : ${format.userRole}`,
    `Nombre de tours max : ${format.maxTurns}`,
    '',
    'Règles :',
    ...format.rules.map((r) => `- ${r}`),
  ].join('\n')
}
