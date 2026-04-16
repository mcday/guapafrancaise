/**
 * Section A Scenario Templates — phone call information-gathering
 * Based on official TEFAQ document types and question categories
 */

import type { TEFAQTopic } from '@/types/dictee'

export interface ScenarioTemplate {
  topic: TEFAQTopic
  documentTypes: string[]
  typicalQuestionCategories: string[]
  exampleSituationFr: string
  exampleSituationEs: string
}

export const SECTION_A_SCENARIOS: ScenarioTemplate[] = [
  {
    topic: 'travail',
    documentTypes: ['offre d\'emploi', 'annonce de stage', 'formation professionnelle'],
    typicalQuestionCategories: [
      'responsabilités', 'horaires', 'salaire', 'type de contrat',
      'qualifications requises', 'date de début', 'taille de l\'équipe',
      'formation offerte', 'perspectives de carrière', 'processus de candidature',
    ],
    exampleSituationFr: 'Vous avez lu une offre d\'emploi pour un poste de {rôle} dans une {entreprise}. Vous téléphonez pour avoir plus d\'informations.',
    exampleSituationEs: 'Has leído una oferta de empleo para un puesto de {rol} en una {empresa}. Llamas para obtener más información.',
  },
  {
    topic: 'logement',
    documentTypes: ['annonce d\'appartement', 'colocation', 'résidence étudiante'],
    typicalQuestionCategories: [
      'prix', 'charges incluses', 'superficie', 'étage',
      'meublé/non meublé', 'équipement cuisine', 'type de chauffage',
      'stationnement', 'animaux acceptés', 'caution', 'durée du bail', 'quartier',
    ],
    exampleSituationFr: 'Vous avez lu une annonce pour un appartement à {ville}. Vous téléphonez au propriétaire pour avoir plus d\'informations.',
    exampleSituationEs: 'Has leído un anuncio para un apartamento en {ciudad}. Llamas al propietario para obtener más información.',
  },
  {
    topic: 'loisirs',
    documentTypes: ['activité sportive', 'cours de loisir', 'excursion', 'festival'],
    typicalQuestionCategories: [
      'prix', 'horaire', 'durée', 'conditions d\'âge/niveau',
      'équipement à apporter', 'taille du groupe', 'guide fourni',
      'lieu', 'processus d\'inscription', 'politique d\'annulation',
    ],
    exampleSituationFr: 'Vous avez lu une annonce pour {activité} organisée par {organisme}. Vous téléphonez pour avoir plus d\'informations.',
    exampleSituationEs: 'Has leído un anuncio para {actividad} organizada por {organismo}. Llamas para obtener más información.',
  },
  {
    topic: 'education',
    documentTypes: ['cours de français', 'programme universitaire', 'atelier', 'conférence'],
    typicalQuestionCategories: [
      'prix', 'dates', 'durée', 'prérequis',
      'certificat obtenu', 'nombre de participants', 'matériel fourni',
      'modalité (en ligne/présentiel)', 'inscription', 'professeur',
    ],
    exampleSituationFr: 'Vous avez lu une annonce pour un cours de {matière} offert par {institution}. Vous téléphonez pour avoir plus d\'informations.',
    exampleSituationEs: 'Has leído un anuncio para un curso de {materia} ofrecido por {institución}. Llamas para obtener más información.',
  },
  {
    topic: 'sante',
    documentTypes: ['clinique', 'programme de bien-être', 'gym', 'centre sportif'],
    typicalQuestionCategories: [
      'services offerts', 'horaires', 'tarifs', 'abonnement',
      'professionnels disponibles', 'assurance acceptée', 'rendez-vous',
      'lieu', 'équipement', 'cours offerts',
    ],
    exampleSituationFr: 'Vous avez lu une annonce pour {service} au {centre}. Vous téléphonez pour avoir plus d\'informations.',
    exampleSituationEs: 'Has leído un anuncio para {servicio} en {centro}. Llamas para obtener más información.',
  },
  {
    topic: 'transports',
    documentTypes: ['service de transport', 'covoiturage', 'location de véhicule', 'voyage organisé'],
    typicalQuestionCategories: [
      'prix', 'itinéraire', 'horaires', 'durée',
      'conditions', 'réservation', 'bagages', 'assurance',
      'politique d\'annulation', 'points de départ/arrivée',
    ],
    exampleSituationFr: 'Vous avez lu une annonce pour un service de {transport}. Vous téléphonez pour avoir plus d\'informations.',
    exampleSituationEs: 'Has leído un anuncio para un servicio de {transporte}. Llamas para obtener más información.',
  },
  {
    topic: 'culture_quebec',
    documentTypes: ['spectacle', 'exposition', 'festival culturel', 'visite guidée'],
    typicalQuestionCategories: [
      'prix du billet', 'dates et horaires', 'lieu', 'durée',
      'restrictions d\'âge', 'accessibilité', 'transport',
      'stationnement', 'billets disponibles', 'programme',
    ],
    exampleSituationFr: 'Vous avez lu une annonce pour {événement} à {lieu}. Vous téléphonez pour avoir plus d\'informations.',
    exampleSituationEs: 'Has leído un anuncio para {evento} en {lugar}. Llamas para obtener más información.',
  },
  {
    topic: 'vie_quotidienne',
    documentTypes: ['service à domicile', 'garde d\'enfants', 'cours privé', 'service communautaire'],
    typicalQuestionCategories: [
      'prix', 'disponibilité', 'expérience', 'références',
      'zone desservie', 'fréquence', 'conditions', 'contact',
      'essai gratuit', 'annulation',
    ],
    exampleSituationFr: 'Vous avez lu une annonce pour un service de {service} dans votre quartier. Vous téléphonez pour avoir plus d\'informations.',
    exampleSituationEs: 'Has leído un anuncio para un servicio de {servicio} en tu barrio. Llamas para obtener más información.',
  },
  {
    topic: 'environnement',
    documentTypes: ['bénévolat écologique', 'jardin communautaire', 'atelier zéro déchet', 'initiative verte'],
    typicalQuestionCategories: [
      'activités', 'engagement requis', 'horaire', 'lieu',
      'formation', 'exigences', 'public cible', 'contact',
      'équipement fourni', 'inscription',
    ],
    exampleSituationFr: 'Vous avez lu une annonce pour {initiative} organisée par {organisme}. Vous téléphonez pour avoir plus d\'informations.',
    exampleSituationEs: 'Has leído un anuncio para {iniciativa} organizada por {organismo}. Llamas para obtener más información.',
  },
  {
    topic: 'medias',
    documentTypes: ['atelier de journalisme', 'podcast', 'cours de photographie', 'formation médias'],
    typicalQuestionCategories: [
      'contenu', 'format', 'prix', 'durée',
      'prérequis techniques', 'matériel nécessaire', 'certification',
      'instructeur', 'horaire', 'inscription',
    ],
    exampleSituationFr: 'Vous avez lu une annonce pour {formation} proposée par {organisme}. Vous téléphonez pour avoir plus d\'informations.',
    exampleSituationEs: 'Has leído un anuncio para {formación} propuesta por {organismo}. Llamas para obtener más información.',
  },
]

/** Get scenario templates for a given topic */
export function getScenariosForTopic(topic: TEFAQTopic): ScenarioTemplate | undefined {
  return SECTION_A_SCENARIOS.find((s) => s.topic === topic)
}

/** For prompt injection: compact scenario template text */
export function getScenarioTemplateText(topic: TEFAQTopic): string {
  const scenario = getScenariosForTopic(topic)
  if (!scenario) return ''
  return [
    `Types de documents : ${scenario.documentTypes.join(', ')}`,
    `Catégories de questions typiques : ${scenario.typicalQuestionCategories.join(', ')}`,
  ].join('\n')
}
