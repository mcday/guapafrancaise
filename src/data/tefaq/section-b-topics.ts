/**
 * Section B Topic Bank — persuasion/argumentation scenarios
 * The examiner plays a skeptical friend who resists
 */

import type { TEFAQTopic } from '@/types/dictee'
import type { DifficultyLevel } from '@/types/dictee'

export interface SectionBTopic {
  topic: TEFAQTopic
  difficulty: DifficultyLevel
  promptFr: string
  promptEs: string
  friendResistanceAngle: string
  suggestedObjections: string[]
}

export const SECTION_B_TOPICS: SectionBTopic[] = [
  // A2 topics — simple, everyday
  {
    topic: 'loisirs',
    difficulty: 'A2',
    promptFr: 'Vous avez vu une annonce pour un cours de cuisine québécoise le samedi matin. Vous en parlez à un(e) ami(e) qui n\'aime pas cuisiner. Essayez de le/la convaincre de s\'inscrire avec vous.',
    promptEs: 'Has visto un anuncio para un curso de cocina quebequense el sábado por la mañana. Se lo cuentas a un(a) amigo(a) que no le gusta cocinar. Intenta convencerlo(a) de inscribirse contigo.',
    friendResistanceAngle: 'practical',
    suggestedObjections: ['Je ne sais pas cuisiner', 'Le samedi je dors', 'Ça ne m\'intéresse pas'],
  },
  {
    topic: 'sante',
    difficulty: 'A2',
    promptFr: 'Vous avez lu une annonce pour un cours de yoga gratuit au parc. Vous en parlez à un(e) ami(e) qui ne fait jamais de sport. Essayez de le/la convaincre d\'y aller.',
    promptEs: 'Has leído un anuncio para una clase de yoga gratuita en el parque. Se lo cuentas a un(a) amigo(a) que nunca hace deporte. Intenta convencerlo(a) de ir.',
    friendResistanceAngle: 'emotional',
    suggestedObjections: ['Je n\'aime pas le sport', 'J\'ai peur d\'avoir l\'air ridicule', 'Je n\'ai pas le temps'],
  },
  // B1 topics
  {
    topic: 'culture_quebec',
    difficulty: 'B1',
    promptFr: 'Vous avez vu une annonce pour le Festival de jazz de Montréal. Vous en parlez à un(e) ami(e) qui préfère rester chez lui/elle. Essayez de le/la convaincre de vous accompagner.',
    promptEs: 'Has visto un anuncio para el Festival de Jazz de Montreal. Se lo cuentas a un(a) amigo(a) que prefiere quedarse en casa. Intenta convencerlo(a) de acompañarte.',
    friendResistanceAngle: 'emotional',
    suggestedObjections: ['Je préfère écouter de la musique chez moi', 'Il y a trop de monde', 'C\'est trop loin'],
  },
  {
    topic: 'environnement',
    difficulty: 'B1',
    promptFr: 'Vous avez lu une annonce pour un atelier de jardinage communautaire. Vous en parlez à un(e) ami(e) qui n\'a jamais jardiné. Essayez de le/la convaincre de participer.',
    promptEs: 'Has leído un anuncio para un taller de jardinería comunitaria. Se lo cuentas a un(a) amigo(a) que nunca ha hecho jardinería. Intenta convencerlo(a) de participar.',
    friendResistanceAngle: 'practical',
    suggestedObjections: ['Je n\'ai pas la main verte', 'Je n\'ai pas le temps', 'C\'est salissant'],
  },
  {
    topic: 'loisirs',
    difficulty: 'B1',
    promptFr: 'Vous avez vu une annonce pour un club de randonnée qui organise des sorties chaque dimanche. Vous en parlez à un(e) ami(e) qui est plutôt sédentaire. Essayez de le/la convaincre de s\'inscrire.',
    promptEs: 'Has visto un anuncio para un club de senderismo que organiza salidas cada domingo. Se lo cuentas a un(a) amigo(a) que es bastante sedentario(a). Intenta convencerlo(a) de inscribirse.',
    friendResistanceAngle: 'practical',
    suggestedObjections: ['Je ne suis pas en forme', 'Le dimanche c\'est mon jour de repos', 'Je n\'ai pas l\'équipement'],
  },
  // B1+ topics
  {
    topic: 'education',
    difficulty: 'B1+',
    promptFr: 'Vous avez lu une annonce pour un programme d\'échange linguistique avec des Québécois. Vous en parlez à un(e) ami(e) qui est timide. Essayez de le/la convaincre de s\'inscrire.',
    promptEs: 'Has leído un anuncio para un programa de intercambio lingüístico con quebequenses. Se lo cuentas a un(a) amigo(a) que es tímido(a). Intenta convencerlo(a) de inscribirse.',
    friendResistanceAngle: 'emotional',
    suggestedObjections: ['Je suis trop timide', 'Mon français n\'est pas assez bon', 'Je ne connais personne'],
  },
  {
    topic: 'travail',
    difficulty: 'B1+',
    promptFr: 'Vous avez lu une annonce pour un atelier de développement professionnel gratuit offert par la bibliothèque. Vous en parlez à un(e) ami(e) qui cherche du travail mais qui ne se sent pas motivé(e). Essayez de le/la convaincre d\'y assister.',
    promptEs: 'Has leído un anuncio para un taller gratuito de desarrollo profesional ofrecido por la biblioteca. Se lo cuentas a un(a) amigo(a) que busca trabajo pero no se siente motivado(a). Intenta convencerlo(a) de asistir.',
    friendResistanceAngle: 'emotional',
    suggestedObjections: ['Ça ne sert à rien', 'J\'ai déjà essayé', 'Je ne suis pas motivé(e)'],
  },
  // B2 topics — more complex, nuanced situations
  {
    topic: 'vie_quotidienne',
    difficulty: 'B2',
    promptFr: 'Vous avez lu une annonce pour un service de paniers bio livrés à domicile chaque semaine. Vous en parlez à un(e) ami(e) qui trouve que manger bio est trop cher. Essayez de le/la convaincre de s\'abonner.',
    promptEs: 'Has leído un anuncio para un servicio de canastas orgánicas entregadas a domicilio cada semana. Se lo cuentas a un(a) amigo(a) que piensa que comer orgánico es muy caro. Intenta convencerlo(a) de suscribirse.',
    friendResistanceAngle: 'financial',
    suggestedObjections: ['C\'est trop cher', 'Je n\'aime pas tous les légumes', 'Le supermarché me suffit', 'Je n\'ai pas le temps de cuisiner tout ça'],
  },
  {
    topic: 'transports',
    difficulty: 'B2',
    promptFr: 'Vous avez lu une annonce pour un service d\'autopartage dans votre quartier. Vous en parlez à un(e) ami(e) qui tient absolument à sa voiture personnelle. Essayez de le/la convaincre d\'essayer.',
    promptEs: 'Has leído un anuncio para un servicio de auto compartido en tu barrio. Se lo cuentas a un(a) amigo(a) que se aferra a su auto personal. Intenta convencerlo(a) de probarlo.',
    friendResistanceAngle: 'practical',
    suggestedObjections: ['J\'ai besoin de ma voiture tous les jours', 'C\'est moins pratique', 'Et si la voiture n\'est pas disponible ?', 'Je ne fais pas confiance aux autres conducteurs'],
  },
  {
    topic: 'culture_quebec',
    difficulty: 'B2',
    promptFr: 'Vous avez lu une annonce pour un stage intensif de théâtre d\'improvisation en français. Vous en parlez à un(e) ami(e) qui a le trac. Essayez de le/la convaincre de s\'inscrire avec vous.',
    promptEs: 'Has leído un anuncio para un taller intensivo de teatro de improvisación en francés. Se lo cuentas a un(a) amigo(a) que tiene miedo escénico. Intenta convencerlo(a) de inscribirse contigo.',
    friendResistanceAngle: 'emotional',
    suggestedObjections: ['J\'ai le trac', 'Je ne suis pas drôle', 'C\'est trop intimidant', 'Je préfère rester spectateur'],
  },
  // C1 topics — abstract and complex
  {
    topic: 'medias',
    difficulty: 'C1',
    promptFr: 'Vous avez lu une annonce pour une résidence créative de podcasting sur les enjeux sociaux au Québec. Vous en parlez à un(e) ami(e) journaliste qui doute de l\'impact des podcasts. Essayez de le/la convaincre de postuler.',
    promptEs: 'Has leído un anuncio para una residencia creativa de podcasting sobre temas sociales en Quebec. Se lo cuentas a un(a) amigo(a) periodista que duda del impacto de los podcasts. Intenta convencerlo(a) de postularse.',
    friendResistanceAngle: 'practical',
    suggestedObjections: ['Les podcasts, tout le monde en fait', 'Ça ne remplace pas le journalisme sérieux', 'Je n\'ai pas le matériel', 'C\'est un engagement trop important'],
  },
  {
    topic: 'environnement',
    difficulty: 'C1',
    promptFr: 'Vous avez lu une annonce pour un projet de cohabitation écologique en banlieue de Montréal. Vous en parlez à un(e) ami(e) qui aime sa vie en ville. Essayez de le/la convaincre de visiter le projet.',
    promptEs: 'Has leído un anuncio para un proyecto de cohabitación ecológica en los suburbios de Montreal. Se lo cuentas a un(a) amigo(a) que ama su vida en la ciudad. Intenta convencerlo(a) de visitar el proyecto.',
    friendResistanceAngle: 'practical',
    suggestedObjections: ['Je suis bien en ville', 'C\'est trop loin de tout', 'Vivre en communauté ne m\'attire pas', 'C\'est un mode de vie trop radical'],
  },
]

/** Get topics by difficulty level */
export function getTopicsByDifficulty(difficulty: DifficultyLevel): SectionBTopic[] {
  return SECTION_B_TOPICS.filter((t) => t.difficulty === difficulty)
}

/** Get topics by topic category */
export function getTopicsByCategory(topic: TEFAQTopic): SectionBTopic[] {
  return SECTION_B_TOPICS.filter((t) => t.topic === topic)
}
