import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import type { ComprehensionQuestion } from '@/types/comprehension'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { cn } from '@/lib/utils'

interface QuestionCardProps {
  question: ComprehensionQuestion
  selectedAnswer: string | undefined
  showResult: boolean
  onAnswer: (optionId: string) => void
}

export function QuestionCard({ question, selectedAnswer, showResult, onAnswer }: QuestionCardProps) {
  const showHints = useSettingsStore((s) => s.showSpanishHints)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {/* Question */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <p className="text-sm font-medium text-gray-800 leading-relaxed">
          {question.questionText}
        </p>
        {showHints && question.questionTextEs && (
          <p className="text-xs text-gray-400 mt-1 italic">{question.questionTextEs}</p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.id
          const isCorrect = option.id === question.correctOptionId
          const showCorrect = showResult && isCorrect
          const showIncorrect = showResult && isSelected && !isCorrect

          return (
            <motion.button
              key={option.id}
              whileTap={showResult ? undefined : { scale: 0.98 }}
              onClick={() => !showResult && onAnswer(option.id)}
              disabled={showResult}
              className={cn(
                'w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all',
                !showResult && !isSelected && 'border-gray-100 bg-white hover:border-gray-200',
                !showResult && isSelected && 'border-quebec-400 bg-quebec-50',
                showCorrect && 'border-correct bg-turquoise-50',
                showIncorrect && 'border-incorrect bg-red-50'
              )}
            >
              <span
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                  !showResult && !isSelected && 'bg-gray-100 text-gray-500',
                  !showResult && isSelected && 'bg-quebec-500 text-white',
                  showCorrect && 'bg-correct text-white',
                  showIncorrect && 'bg-incorrect text-white'
                )}
              >
                {showCorrect ? (
                  <Check className="w-3.5 h-3.5" />
                ) : showIncorrect ? (
                  <X className="w-3.5 h-3.5" />
                ) : (
                  option.id.toUpperCase()
                )}
              </span>
              <span className="text-sm text-gray-700">{option.text}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Explanation */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-turquoise-50 rounded-xl p-3 border border-turquoise-100"
        >
          <p className="text-xs font-medium text-turquoise-700">{question.explanation}</p>
          {showHints && question.explanationEs && (
            <p className="text-xs text-turquoise-500 mt-1 italic">{question.explanationEs}</p>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
