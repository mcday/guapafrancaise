import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { QuestionCard } from './QuestionCard'
import type { ComprehensionQuestion } from '@/types/comprehension'

interface QuestionSetProps {
  questions: ComprehensionQuestion[]
  onComplete: (answers: Record<string, string>) => void
}

export function QuestionSet({ questions, onComplete }: QuestionSetProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)
  const answersRef = useRef(answers)

  const question = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1
  const selectedAnswer = answers[question.id]

  function handleAnswer(optionId: string) {
    const updated = { ...answers, [question.id]: optionId }
    setAnswers(updated)
    answersRef.current = updated
    setTimeout(() => setShowResult(true), 300)
  }

  function handleNext() {
    setShowResult(false)
    if (isLast) {
      onComplete(answersRef.current)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-quebec-500 to-quebec-400 rounded-full"
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ type: 'spring', damping: 20 }}
          />
        </div>
        <span className="text-xs font-medium text-gray-400">
          {currentIndex + 1}/{questions.length}
        </span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <QuestionCard
          key={question.id}
          question={question}
          selectedAnswer={selectedAnswer}
          showResult={showResult}
          onAnswer={handleAnswer}
        />
      </AnimatePresence>

      {/* Next button */}
      {showResult && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          className="w-full py-3 bg-quebec-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-quebec-600 transition-colors"
        >
          {isLast ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Terminer
            </>
          ) : (
            <>
              Suivante
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      )}
    </div>
  )
}
