/**
 * Oral exam prompt builders — inject TEFAQ reference data into each prompt
 */

import type { OralSection, ConversationTurn, OralScenario } from '@/types/oral'
import type { TEFAQTopic, DifficultyLevel } from '@/types/dictee'
import { TOPIC_LABELS } from '@/lib/constants'
import { getRubricPromptText } from '@/data/tefaq/evaluation-rubrics'
import { getCEFRPromptText } from '@/data/tefaq/cefr-descriptors'
import { getScenarioTemplateText } from '@/data/tefaq/section-a-scenarios'
import { getFormatRulesText, EXAMINER_OBJECTION_PATTERN } from '@/data/tefaq/exam-format'
import { getTopicsByDifficulty } from '@/data/tefaq/section-b-topics'

/**
 * 1. Generate a scenario for the oral exam
 */
export function buildOralScenarioPrompt(
  section: OralSection,
  topic: TEFAQTopic,
  difficulty: DifficultyLevel
): string {
  const topicLabel = TOPIC_LABELS[topic].fr
  const formatRules = getFormatRulesText(section === 'section_a' ? 'a' : 'b')
  const cefrDesc = getCEFRPromptText(difficulty)

  let extraContext = ''
  if (section === 'section_a') {
    extraContext = '\nCatégories de questions pour ce thème :\n' + getScenarioTemplateText(topic)
  } else {
    const topics = getTopicsByDifficulty(difficulty)
    if (topics.length > 0) {
      extraContext = '\nExemples de sujets similaires pour inspiration :\n' + topics.slice(0, 2).map((t) => '- ' + t.promptFr).join('\n')
    }
  }

  const sectionDesc = section === 'section_a'
    ? 'Section A (obtenir des informations)'
    : 'Section B (convaincre un(e) ami(e))'

  const scenarioGuidance = section === 'section_a'
    ? "Crée une annonce réaliste (service, emploi, activité, logement, etc.) avec suffisamment de détails pour que le candidat puisse poser ~10 questions."
    : "Crée une situation où le candidat doit convaincre un(e) ami(e) sceptique. L'ami(e) doit avoir des raisons crédibles de résister."

  const openingExample = section === 'section_a'
    ? "Allô, [organisme], bonjour ! Comment puis-je vous aider ?"
    : "Salut ! Ça va ? Qu'est-ce que tu voulais me dire ?"

  const opinionFields = section === 'section_b'
    ? '  "opinionPromptFr": "Le sujet de persuasion spécifique",\n  "opinionPromptEs": "El tema de persuasión específico",\n'
    : ''

  return [
    "Tu es un concepteur d'examens TEFAQ (Test d'Évaluation de Français Adapté au Québec).",
    '',
    "Crée un scénario de simulation pour l'Expression Orale — " + sectionDesc + '.',
    '',
    'Thème : ' + topicLabel,
    'Niveau CECRL cible : ' + difficulty,
    '',
    formatRules,
    '',
    cefrDesc,
    extraContext,
    '',
    'IMPORTANT : Le scénario doit être ORIGINAL et RÉALISTE — comme un vrai document TEFAQ.',
    scenarioGuidance,
    '',
    'RÉPONSE EN JSON UNIQUEMENT (pas de markdown, pas de commentaires) :',
    '{',
    '  "situationFr": "Description complète de la situation pour le candidat",',
    '  "situationEs": "Descripción completa de la situación para el candidato",',
    '  "roleAI": "Rôle que joue l\'IA dans ce scénario",',
    '  "roleUser": "Rôle du candidat",',
    '  "objectivesFr": ["objectif 1", "objectif 2", "objectif 3"],',
    '  "objectivesEs": ["objetivo 1", "objetivo 2", "objetivo 3"],',
    opinionFields + '  "openingLineFr": "' + openingExample + '"',
    '}',
  ].join('\n')
}

/**
 * 2. Generate AI response during Section A conversation
 */
export function buildOralConversationPrompt(
  scenario: OralScenario,
  turns: ConversationTurn[],
  userLastMessage: string
): string {
  const conversationHistory = turns
    .map((t) => (t.role === 'user' ? 'CANDIDAT' : 'INTERLOCUTEUR') + ': ' + t.text)
    .join('\n')

  const isLastTurn = scenario.maxTurns ? turns.length >= (scenario.maxTurns - 2) : false
  const lastTurnNote = isLastTurn
    ? '- La conversation touche à sa fin. Donne une réponse qui permet une conclusion naturelle.\n'
    : ''

  if (scenario.section === 'section_a') {
    return [
      'Tu joues le rôle suivant dans un examen TEFAQ Section A (appel téléphonique formel) :',
      'RÔLE : ' + scenario.roleAI,
      '',
      'SITUATION : ' + scenario.situationFr,
      '',
      'RÈGLES POUR TON PERSONNAGE :',
      '- Tu es la personne contactée par téléphone. Réponds naturellement.',
      '- Donne des réponses BRÈVES et parfois VAGUES pour forcer le candidat à poser des questions de suivi.',
      "- Ne donne JAMAIS d'informations que le candidat n'a pas demandées.",
      "- Si le candidat utilise le tutoiement (tu), continue normalement — c'est l'évaluateur qui notera l'erreur, pas toi.",
      '- Donne parfois une réponse incomplète pour tester si le candidat demande des précisions.',
      '- Parle au niveau de langue ' + scenario.difficulty + ' — ajuste ta complexité linguistique.',
      lastTurnNote,
      "CONVERSATION JUSQU'ICI :",
      conversationHistory,
      'CANDIDAT: ' + userLastMessage,
      '',
      'Réponds en 1-3 phrases comme ton personnage. PAS de JSON — texte brut uniquement.',
    ].join('\n')
  }

  // Section B — skeptical friend
  const objectionCategories = EXAMINER_OBJECTION_PATTERN.categories
    .map((c) => c.type + ': ' + c.examplesFr.join(' / '))
    .join('\n')

  return [
    "Tu joues le rôle d'un(e) ami(e) sceptique dans un examen TEFAQ Section B.",
    'RÔLE : ' + scenario.roleAI,
    '',
    'SITUATION : ' + scenario.situationFr,
    '',
    'RÈGLES POUR TON PERSONNAGE :',
    '- Tu es un(e) ami(e) qui RÉSISTE aux arguments du candidat.',
    '- Tu utilises le tutoiement (tu) — registre informel et amical.',
    '- Tu ne dis JAMAIS oui. Tu soulèves toujours une nouvelle objection.',
    "- Alterne entre types d'objections :",
    objectionCategories,
    '- Reconnais brièvement l\'argument du candidat avant d\'objecter ("Ouais ok, mais...")',
    '- Si le candidat reste silencieux trop longtemps, relance avec "Et alors ?" ou "Tu me convaincs pas encore..."',
    '- Parle au niveau ' + scenario.difficulty + ' — ajuste ta complexité.',
    lastTurnNote,
    "CONVERSATION JUSQU'ICI :",
    conversationHistory,
    'CANDIDAT: ' + userLastMessage,
    '',
    'Réponds en 1-3 phrases comme ton personnage. PAS de JSON — texte brut uniquement.',
  ].join('\n')
}

/**
 * 3. Evaluate the oral performance
 */
export function buildOralEvaluationPrompt(
  section: OralSection,
  scenario: OralScenario,
  turns: ConversationTurn[]
): string {
  const fullTranscript = turns
    .map((t) => (t.role === 'user' ? 'CANDIDAT' : 'EXAMINATEUR') + ': ' + t.text)
    .join('\n')

  const rubrics = getRubricPromptText()
  const sectionLabel = section === 'section_a' ? 'A' : 'B'

  const sectionSpecificDetection = section === 'section_a'
    ? [
        'DÉTECTION SPÉCIFIQUE SECTION A :',
        '- Nombre de questions posées par le candidat',
        '- Variété des questions (ouvertes vs fermées, suivis vs nouveaux sujets)',
        '- Utilisation du vouvoiement (TOUTE utilisation de "tu" = pénalité de registre)',
        '- Catégories couvertes (prix, horaire, conditions, lieu, etc.)',
        '- Questions de suivi après les réponses',
        '- Demandes de clarification ("Pourriez-vous préciser... ?")',
      ].join('\n')
    : [
        'DÉTECTION SPÉCIFIQUE SECTION B :',
        '- Utilisation du tutoiement (TOUTE utilisation de "vous" = pénalité SÉVÈRE de registre)',
        '- Présentation du document au début (absente = pénalité de structure)',
        "- Nombre d'arguments distincts (pas de répétitions)",
        '- Schéma concession + contre-argument',
        '- Arguments spécifiques au document vs génériques',
        '- Propositions de compromis',
        '- Réaction aux objections spécifiques soulevées',
        '- Variété du vocabulaire de persuasion',
        '- Connecteurs discursifs (adversatifs, concessifs, causaux)',
      ].join('\n')

  return [
    "Tu es un évaluateur TEFAQ certifié. Évalue la performance orale suivante selon les critères officiels.",
    '',
    '=== SCÉNARIO ===',
    'Section ' + sectionLabel + ': ' + scenario.situationFr,
    'Niveau cible: ' + scenario.difficulty,
    'Rôle IA: ' + scenario.roleAI,
    'Rôle candidat: ' + scenario.roleUser,
    '',
    '=== TRANSCRIPTION COMPLÈTE ===',
    fullTranscript,
    '',
    "=== GRILLE D'ÉVALUATION OFFICIELLE ===",
    rubrics,
    '',
    sectionSpecificDetection,
    '',
    'IMPORTANT — CALIBRATION B1/B2 :',
    "La frontière B1/B2 est la plus contestée et la plus importante (B2 >= 400 = immigration au Québec).",
    'Sois TRÈS PRÉCIS avec des preuves spécifiques tirées de la transcription.',
    'Pour chaque critère, cite CE QUE le candidat a dit et montre ce que B2 attendrait.',
    '',
    'La distinction B1 vs B2 : Un locuteur B1 dit "C\'est bien. Ça coûte pas cher. C\'est pas loin."',
    'Un locuteur B2 dit "Non seulement c\'est accessible financièrement, mais en plus la localisation est parfaite."',
    '',
    'RÉPONSE EN JSON UNIQUEMENT :',
    '{',
    '  "overallScore": "0-100 (number)",',
    '  "tefaqEquivalent": "0-20 (number)",',
    '  "cefrEstimate": "A2|B1|B2|C1",',
    '  "rubricScores": [',
    '    {',
    '      "criterionId": "criterion_1a|criterion_1b|criterion_2a|criterion_2b|criterion_2c",',
    '      "criterionNameFr": "nom du critère",',
    '      "score": "0-5 (number)",',
    '      "maxScore": 5,',
    '      "feedbackFr": "feedback détaillé avec citations de la transcription",',
    '      "feedbackEs": "feedback en español",',
    '      "exampleBetterFr": "exemple concret de ce que B2 dirait"',
    '    }',
    '  ],',
    '  "strengthsFr": ["point fort 1", "point fort 2"],',
    '  "strengthsEs": ["fortaleza 1", "fortaleza 2"],',
    '  "weaknessesFr": ["point à améliorer 1"],',
    '  "weaknessesEs": ["punto a mejorar 1"],',
    '  "improvementTipsFr": ["conseil prioritaire 1 pour la prochaine session"],',
    '  "improvementTipsEs": ["consejo prioritario 1"],',
    '  "correctedTranscriptFr": "version corrigée des phrases du candidat"',
    '}',
  ].join('\n')
}
