import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useExerciseStore } from '@/stores/useExerciseStore'
import { cn } from '@/lib/utils'

interface ManualCorrectionProps {
  referenceText: string
  onComplete: (errorCount: number, totalWords: number) => void
}

export function ManualCorrection({ referenceText, onComplete }: ManualCorrectionProps) {
  const { manualErrors, addManualError, removeManualError } = useExerciseStore()
  const words = referenceText.split(/\s+/)
  const [submitted, setSubmitted] = useState(false)

  const errorIndices = new Set(manualErrors.map((e) => e.wordIndex))

  function toggleWord(index: number) {
    if (submitted) return
    if (errorIndices.has(index)) {
      removeManualError(index)
    } else {
      addManualError({
        wordIndex: index,
        originalWord: words[index],
        type: 'wrong',
      })
    }
  }

  function handleSubmit() {
    setSubmitted(true)
    onComplete(manualErrors.length, words.length)
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 space-y-4">
      <div>
        <h3 className="font-display font-semibold text-gray-700 mb-1">Correction</h3>
        <p className="text-xs text-gray-400">
          Tape sur chaque mot qu'elle a mal écrit
        </p>
      </div>

      {/* Word grid */}
      <div className="p-3 bg-gray-50 rounded-xl flex flex-wrap gap-1.5">
        {words.map((word, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleWord(i)}
            disabled={submitted}
            className={cn(
              'px-2 py-1 rounded-lg text-sm font-mono transition-all',
              errorIndices.has(i)
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300',
              submitted && 'cursor-default'
            )}
          >
            {word}
          </motion.button>
        ))}
      </div>

      {/* Error count */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          Erreurs marquées : <strong className="text-incorrect">{manualErrors.length}</strong>
        </span>
        <span className="text-gray-400">
          {words.length} mots au total
        </span>
      </div>

      {/* Submit */}
      {!submitted ? (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className="w-full py-3 bg-terracotta-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-terracotta-600 transition-colors"
        >
          <Check className="w-4 h-4" />
          Valider la correction
        </motion.button>
      ) : (
        <div className="flex items-center gap-2 justify-center py-2 text-sm">
          {manualErrors.length === 0 ? (
            <span className="text-correct font-medium flex items-center gap-1">
              <Check className="w-4 h-4" /> Parfait !
            </span>
          ) : (
            <span className="text-gray-500">
              {manualErrors.length} erreur{manualErrors.length > 1 ? 's' : ''} sur {words.length} mots
            </span>
          )}
        </div>
      )}
    </div>
  )
}
