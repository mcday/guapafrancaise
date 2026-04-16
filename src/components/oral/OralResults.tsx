import { motion } from 'framer-motion'
import { RotateCcw, Home, Trophy } from 'lucide-react'
import { Link } from 'react-router'
import { Alpaca } from '@/components/mascot/Alpaca'
import { OralEvaluationDisplay } from './OralEvaluationDisplay'
import type { OralEvaluation } from '@/types/oral'

interface OralResultsProps {
  evaluation: OralEvaluation
  xpEarned: number
  onRestart: () => void
}

export function OralResults({ evaluation, xpEarned, onRestart }: OralResultsProps) {
  const mood = evaluation.overallScore >= 70 ? 'celebrating' : evaluation.overallScore >= 50 ? 'happy' : 'idle'

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-2"
      >
        <Alpaca mood={mood} size={90} className="mx-auto" />
        <h3 className="font-display text-xl font-bold text-gray-800">Oral terminé !</h3>
        <div className="flex items-center justify-center gap-2">
          <Trophy className="w-4 h-4 text-gold-500" />
          <span className="font-display font-bold text-gold-600">+{xpEarned} XP</span>
        </div>
      </motion.div>

      {/* Evaluation */}
      <OralEvaluationDisplay evaluation={evaluation} />

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onRestart}
          className="flex-1 py-3 bg-terracotta-500 text-white font-medium rounded-xl flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Encore
        </motion.button>
        <Link
          to="/"
          className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          Accueil
        </Link>
      </div>
    </div>
  )
}
