const strings = {
  // Navigation
  'nav.home': { fr: 'Accueil', es: 'Inicio' },
  'nav.dictee': { fr: 'Dictée', es: 'Dictado' },
  'nav.comprehension': { fr: 'Compréhension', es: 'Comprensión' },
  'nav.progress': { fr: 'Progrès', es: 'Progreso' },
  'nav.settings': { fr: 'Réglages', es: 'Ajustes' },

  // Home
  'home.welcome': { fr: 'Bonjour, Guapa!', es: 'Hola, Guapa!' },
  'home.streak': { fr: 'Série en cours', es: 'Racha actual' },
  'home.quickStart': { fr: 'Commencer', es: 'Comenzar' },
  'home.days': { fr: 'jours', es: 'días' },

  // Dictée
  'dictee.title': { fr: 'Dictée', es: 'Dictado' },
  'dictee.solo': { fr: 'Mode solo', es: 'Modo solo' },
  'dictee.accompanied': { fr: 'Mode accompagné', es: 'Modo acompañado' },
  'dictee.topic': { fr: 'Thème', es: 'Tema' },
  'dictee.difficulty': { fr: 'Niveau', es: 'Nivel' },
  'dictee.generate': { fr: 'Générer une dictée', es: 'Generar un dictado' },
  'dictee.listen': { fr: 'Écouter', es: 'Escuchar' },
  'dictee.replay': { fr: 'Réécouter', es: 'Volver a escuchar' },
  'dictee.submit': { fr: 'Vérifier', es: 'Verificar' },
  'dictee.typeHere': { fr: 'Écris ce que tu entends...', es: 'Escribe lo que escuchas...' },
  'dictee.score': { fr: 'Résultat', es: 'Resultado' },
  'dictee.accuracy': { fr: 'Précision', es: 'Precisión' },
  'dictee.paperMode': { fr: 'Elle écrit sur papier', es: 'Ella escribe en papel' },
  'dictee.done': { fr: "C'est fait !", es: '¡Listo!' },
  'dictee.markErrors': { fr: 'Marquer les erreurs', es: 'Marcar los errores' },
  'dictee.generating': { fr: 'Génération en cours...', es: 'Generando...' },

  // Comprehension
  'comp.title': { fr: 'Compréhension orale', es: 'Comprensión oral' },
  'comp.question': { fr: 'Question', es: 'Pregunta' },
  'comp.next': { fr: 'Suivante', es: 'Siguiente' },
  'comp.finish': { fr: 'Terminer', es: 'Terminar' },
  'comp.correct': { fr: 'Correct !', es: '¡Correcto!' },
  'comp.incorrect': { fr: 'Incorrect', es: 'Incorrecto' },

  // Gamification
  'xp.gained': { fr: 'XP gagnés', es: 'XP ganados' },
  'level.up': { fr: 'Niveau supérieur !', es: '¡Subiste de nivel!' },
  'badge.unlocked': { fr: 'Badge débloqué !', es: '¡Insignia desbloqueada!' },
  'streak.days': { fr: 'jours de suite', es: 'días seguidos' },

  // Settings
  'settings.title': { fr: 'Réglages', es: 'Ajustes' },
  'settings.apiKey': { fr: 'Clé API', es: 'Clave API' },
  'settings.provider': { fr: 'Fournisseur IA', es: 'Proveedor IA' },
  'settings.voice': { fr: 'Voix', es: 'Voz' },
  'settings.speed': { fr: 'Vitesse', es: 'Velocidad' },
  'settings.hints': { fr: 'Aide en espagnol', es: 'Ayuda en español' },
  'settings.sound': { fr: 'Effets sonores', es: 'Efectos de sonido' },
  'settings.test': { fr: 'Tester la connexion', es: 'Probar la conexión' },
  'settings.save': { fr: 'Enregistrer', es: 'Guardar' },

  // Progress
  'progress.title': { fr: 'Mes progrès', es: 'Mi progreso' },
  'progress.history': { fr: 'Historique', es: 'Historial' },
  'progress.badges': { fr: 'Badges', es: 'Insignias' },
  'progress.stats': { fr: 'Statistiques', es: 'Estadísticas' },
  'progress.totalExercises': { fr: 'Exercices', es: 'Ejercicios' },
  'progress.avgScore': { fr: 'Score moyen', es: 'Puntuación promedio' },

  // General
  'general.loading': { fr: 'Chargement...', es: 'Cargando...' },
  'general.error': { fr: 'Une erreur est survenue', es: 'Ocurrió un error' },
  'general.retry': { fr: 'Réessayer', es: 'Reintentar' },
  'general.cancel': { fr: 'Annuler', es: 'Cancelar' },
  'general.continue': { fr: 'Continuer', es: 'Continuar' },
  'general.back': { fr: 'Retour', es: 'Volver' },
} as const

type StringKey = keyof typeof strings

export function t(key: StringKey, lang: 'fr' | 'es' = 'fr'): string {
  return strings[key]?.[lang] ?? key
}

export function useI18n() {
  return { t }
}
