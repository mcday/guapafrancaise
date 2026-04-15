import { diffWords } from 'diff'
import type { DiffResult, DiffChange } from '@/types/dictee'
import { normalizeText, isAccentError } from './normalization'

export function computeDicteeDiff(originalText: string, userText: string): DiffResult {
  const normalizedOriginal = normalizeText(originalText)
  const normalizedUser = normalizeText(userText)

  const rawDiff = diffWords(normalizedOriginal, normalizedUser, { ignoreCase: false })

  const changes: DiffChange[] = rawDiff.map((part) => ({
    type: part.added ? 'added' : part.removed ? 'removed' : 'equal',
    value: part.value,
  }))

  // Count stats
  const originalWords = normalizedOriginal.split(/\s+/).filter(Boolean)
  const totalWords = originalWords.length

  let correctWords = 0
  let incorrectWords = 0
  let missingWords = 0
  let extraWords = 0
  let accentErrors = 0

  // Walk through the changes to compute detailed stats
  for (let i = 0; i < changes.length; i++) {
    const change = changes[i]
    const words = change.value.trim().split(/\s+/).filter(Boolean)

    if (change.type === 'equal') {
      correctWords += words.length
    } else if (change.type === 'removed') {
      // Check if next change is 'added' (substitution)
      const next = changes[i + 1]
      if (next && next.type === 'added') {
        const removedWords = words
        const addedWords = next.value.trim().split(/\s+/).filter(Boolean)
        const pairs = Math.min(removedWords.length, addedWords.length)

        for (let j = 0; j < pairs; j++) {
          if (isAccentError(removedWords[j], addedWords[j])) {
            accentErrors++
          } else {
            incorrectWords++
          }
        }
        // Remaining removed words are missing
        missingWords += Math.max(0, removedWords.length - addedWords.length)
        // Remaining added words are extra
        extraWords += Math.max(0, addedWords.length - removedWords.length)
        i++ // Skip the next (added) change
      } else {
        missingWords += words.length
      }
    } else if (change.type === 'added') {
      extraWords += words.length
    }
  }

  const accuracy = totalWords > 0
    ? Math.round((correctWords / totalWords) * 100)
    : 0

  return {
    originalText: normalizedOriginal,
    userText: normalizedUser,
    changes,
    stats: {
      totalWords,
      correctWords,
      incorrectWords,
      missingWords,
      extraWords,
      accentErrors,
      accuracy: Math.max(0, Math.min(100, accuracy)),
    },
  }
}
