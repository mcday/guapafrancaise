export type AlpacaMood = 'idle' | 'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'sleeping'

export const MOOD_MESSAGES: Record<AlpacaMood, { fr: string[]; es: string[] }> = {
  idle: {
    fr: ['Prête pour un exercice ?', "C'est une belle journée pour apprendre !", 'Allez, on y va !'],
    es: ['Lista para un ejercicio?', 'Es un buen día para aprender!', 'Vamos!'],
  },
  happy: {
    fr: ['Bravo, Guapa !', 'Excellent travail !', 'Tu es formidable !', 'Continue comme ça !'],
    es: ['Bravo, Guapa!', 'Excelente trabajo!', 'Eres formidable!', 'Sigue así!'],
  },
  thinking: {
    fr: ['Je prépare ton exercice...', 'Un moment...', 'Je réfléchis...'],
    es: ['Preparando tu ejercicio...', 'Un momento...', 'Estoy pensando...'],
  },
  celebrating: {
    fr: ['Incroyable !', 'Tu es une championne !', 'Wow, quelle performance !'],
    es: ['Increíble!', 'Eres una campeona!', 'Wow, qué rendimiento!'],
  },
  encouraging: {
    fr: ["Ne lâche pas !", "C'est en forgeant qu'on devient forgeron !", 'La prochaine fois sera meilleure !', 'Chaque erreur est une leçon !'],
    es: ['No te rindas!', 'La práctica hace al maestro!', 'La próxima vez será mejor!', 'Cada error es una lección!'],
  },
  sleeping: {
    fr: ['Zzz...', '...'],
    es: ['Zzz...', '...'],
  },
}

export function getRandomMessage(mood: AlpacaMood, lang: 'fr' | 'es' = 'fr'): string {
  const messages = MOOD_MESSAGES[mood][lang]
  return messages[Math.floor(Math.random() * messages.length)]
}
