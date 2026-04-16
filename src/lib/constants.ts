import type { TEFAQTopic, DifficultyLevel } from '@/types/dictee'
import type { Level, Badge } from '@/types/progress'

export const TOPIC_LABELS: Record<TEFAQTopic, { fr: string; es: string }> = {
  vie_quotidienne: { fr: 'Vie quotidienne', es: 'Vida cotidiana' },
  travail: { fr: 'Travail', es: 'Trabajo' },
  logement: { fr: 'Logement', es: 'Vivienda' },
  sante: { fr: 'Santé', es: 'Salud' },
  education: { fr: 'Éducation', es: 'Educación' },
  loisirs: { fr: 'Loisirs', es: 'Ocio' },
  transports: { fr: 'Transports', es: 'Transporte' },
  environnement: { fr: 'Environnement', es: 'Medio ambiente' },
  medias: { fr: 'Médias', es: 'Medios de comunicación' },
  culture_quebec: { fr: 'Culture québécoise', es: 'Cultura quebequense' },
}

export const DIFFICULTY_LABELS: Record<DifficultyLevel, { fr: string; es: string }> = {
  A2: { fr: 'Débutant', es: 'Principiante' },
  B1: { fr: 'Intermédiaire', es: 'Intermedio' },
  'B1+': { fr: 'Intermédiaire avancé', es: 'Intermedio avanzado' },
  B2: { fr: 'Avancé (TEFAQ)', es: 'Avanzado (TEFAQ)' },
  C1: { fr: 'Supérieur', es: 'Superior' },
}

export const LEVELS: Level[] = [
  { id: 1, name: 'Petit Alpaga', nameEs: 'Alpaquita', minXP: 0, maxXP: 99, cefr: 'A2' },
  { id: 2, name: 'Explorateur', nameEs: 'Explorador', minXP: 100, maxXP: 299, cefr: 'A2' },
  { id: 3, name: 'Randonneur', nameEs: 'Excursionista', minXP: 300, maxXP: 599, cefr: 'B1' },
  { id: 4, name: 'Aventurier', nameEs: 'Aventurero', minXP: 600, maxXP: 999, cefr: 'B1' },
  { id: 5, name: 'Voyageur', nameEs: 'Viajero', minXP: 1000, maxXP: 1499, cefr: 'B1+' },
  { id: 6, name: 'Guide Alpin', nameEs: 'Guía Alpino', minXP: 1500, maxXP: 2099, cefr: 'B1+' },
  { id: 7, name: 'Montagnard', nameEs: 'Montanero', minXP: 2100, maxXP: 2999, cefr: 'B2' },
  { id: 8, name: 'Maître des Sommets', nameEs: 'Maestro de Cumbres', minXP: 3000, maxXP: 4199, cefr: 'B2' },
  { id: 9, name: 'Légende du Québec', nameEs: 'Leyenda de Quebec', minXP: 4200, maxXP: 5999, cefr: 'B2' },
  { id: 10, name: 'Alpaga Royal', nameEs: 'Alpaca Real', minXP: 6000, maxXP: Infinity, cefr: 'B2' },
]

export const BADGES: Badge[] = [
  // Streak
  { id: 'streak_3', name: 'Feu Naissant', nameEs: 'Fuego Naciente', description: '3 jours de suite', descriptionEs: '3 días seguidos', icon: 'flame', category: 'streak', condition: { type: 'streak', days: 3 } },
  { id: 'streak_7', name: 'Flamme Constante', nameEs: 'Llama Constante', description: '7 jours de suite', descriptionEs: '7 días seguidos', icon: 'flame', category: 'streak', condition: { type: 'streak', days: 7 } },
  { id: 'streak_14', name: 'Brasier Ardent', nameEs: 'Brasero Ardiente', description: '14 jours de suite', descriptionEs: '14 días seguidos', icon: 'flame', category: 'streak', condition: { type: 'streak', days: 14 } },
  { id: 'streak_30', name: 'Volcan Inextinguible', nameEs: 'Volcán Inextinguible', description: '30 jours de suite', descriptionEs: '30 días seguidos', icon: 'flame', category: 'streak', condition: { type: 'streak', days: 30 } },
  // Volume
  { id: 'ex_1', name: 'Premier Pas', nameEs: 'Primer Paso', description: 'Complète ton premier exercice', descriptionEs: 'Completa tu primer ejercicio', icon: 'footprints', category: 'volume', condition: { type: 'total_exercises', count: 1 } },
  { id: 'ex_10', name: 'Habituée', nameEs: 'Acostumbrada', description: '10 exercices complétés', descriptionEs: '10 ejercicios completados', icon: 'star', category: 'volume', condition: { type: 'total_exercises', count: 10 } },
  { id: 'ex_25', name: 'Assidue', nameEs: 'Asidua', description: '25 exercices complétés', descriptionEs: '25 ejercicios completados', icon: 'trophy', category: 'volume', condition: { type: 'total_exercises', count: 25 } },
  { id: 'ex_50', name: 'Marathonienne', nameEs: 'Maratonista', description: '50 exercices complétés', descriptionEs: '50 ejercicios completados', icon: 'medal', category: 'volume', condition: { type: 'total_exercises', count: 50 } },
  { id: 'ex_100', name: 'Centurion', nameEs: 'Centurión', description: '100 exercices complétés', descriptionEs: '100 ejercicios completados', icon: 'crown', category: 'volume', condition: { type: 'total_exercises', count: 100 } },
  // Accuracy
  { id: 'dictee_90', name: 'Oreille Fine', nameEs: 'Oído Fino', description: '90% de précision moyenne en dictée', descriptionEs: '90% de precisión promedio en dictado', icon: 'ear', category: 'accuracy', condition: { type: 'dictee_accuracy', percentage: 90, minExercises: 5 } },
  { id: 'perfect_1', name: 'Sans Faute', nameEs: 'Sin Errores', description: 'Dictée parfaite', descriptionEs: 'Dictado perfecto', icon: 'sparkles', category: 'accuracy', condition: { type: 'perfect_dictee', count: 1 } },
  { id: 'perfect_5', name: 'Perfectionniste', nameEs: 'Perfeccionista', description: '5 dictées parfaites', descriptionEs: '5 dictados perfectos', icon: 'gem', category: 'accuracy', condition: { type: 'perfect_dictee', count: 5 } },
  // Special
  { id: 'accompanied_5', name: "Travail d'Équipe", nameEs: 'Trabajo en Equipo', description: '5 exercices en mode accompagné', descriptionEs: '5 ejercicios en modo acompañado', icon: 'heart-handshake', category: 'special', condition: { type: 'accompanied_mode', count: 5 } },
  { id: 'level_5', name: 'Demi-Sommet', nameEs: 'Media Cumbre', description: 'Atteindre le niveau 5', descriptionEs: 'Alcanzar el nivel 5', icon: 'mountain', category: 'special', condition: { type: 'level_reached', level: 5 } },
  { id: 'level_10', name: 'Sommet Atteint', nameEs: 'Cumbre Alcanzada', description: 'Atteindre le niveau 10', descriptionEs: 'Alcanzar el nivel 10', icon: 'mountain-snow', category: 'special', condition: { type: 'level_reached', level: 10 } },
  // Oral
  { id: 'oral_1', name: 'Première Parole', nameEs: 'Primera Palabra', description: 'Complète ton premier oral', descriptionEs: 'Completa tu primer oral', icon: 'mic', category: 'volume', condition: { type: 'total_oral', count: 1 } },
  { id: 'oral_10', name: 'Orateur', nameEs: 'Orador', description: '10 exercices oraux', descriptionEs: '10 ejercicios orales', icon: 'mic', category: 'volume', condition: { type: 'total_oral', count: 10 } },
  { id: 'oral_90', name: 'Éloquente', nameEs: 'Elocuente', description: '90% de score moyen à l\'oral', descriptionEs: '90% de puntuación promedio en oral', icon: 'mic', category: 'accuracy', condition: { type: 'oral_accuracy', percentage: 90, minExercises: 3 } },
]

export const XP_RULES = {
  dicteeBase: { A2: 10, B1: 15, 'B1+': 20, B2: 30, C1: 40 } as Record<DifficultyLevel, number>,
  dicteeAccuracyBonus: 5,       // per 10% above 60%
  perfectDicteeBonus: 25,
  comprehensionBase: { A2: 10, B1: 12, 'B1+': 15, B2: 20, C1: 28 } as Record<DifficultyLevel, number>,
  comprehensionCorrectBonus: 5, // per correct above 50%
  oralBase: { A2: 15, B1: 20, 'B1+': 25, B2: 35, C1: 50 } as Record<DifficultyLevel, number>,
  oralAccuracyBonus: 5,         // per 10% above 40%
  dailyFirstBonus: 10,
  streakBonus: 5,               // per 5 days
  accompaniedBonus: 5,
}
