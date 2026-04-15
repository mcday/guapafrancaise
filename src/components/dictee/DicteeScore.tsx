import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'
import type { DiffStats } from '@/types/dictee'
import type { ScoreBreakdown } from '@/services/diff/scoring'
import { Alpaca } from '@/components/mascot/Alpaca'
import type { AlpacaMood } from '@/components/mascot/alpaca-moods'
import { cn } from '@/lib/utils'

interface DicteeScoreProps {
  stats: DiffStats
  xpBreakdown: ScoreBreakdown
  onContinue: () => void
}

export function DicteeScore({ stats, xpBreakdown, onContinue }: DicteeScoreProps) {
  const mood: AlpacaMood =
    stats.accuracy === 100
      ? 'celebrating'
      : stats.accuracy >= 70
        ? 'happy'
        : 'encouraging'

  return (
    <div className="space-y-4">
      {/* Score Circle */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        className="flex flex-col items-center gap-3"
      >
        <div
          className={cn(
            'w-28 h-28 rounded-full flex items-center justify-center shadow-lg',
            stats.accuracy >= 80
              ? 'bg-gradient-to-br from-turquoise-400 to-turquoise-500'
              : stats.accuracy >= 50
                ? 'bg-gradient-to-br from-gold-400 to-gold-500'
                : 'bg-gradient-to-br from-terracotta-400 to-terracotta-500'
          )}
        >
          <span className="text-4xl font-display font-bold text-white">{stats.accuracy}%</span>
        </div>
        <Alpaca mood={mood} size={80} />
      </motion.div>

      {/* XP Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 space-y-2"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-xp" />
          <h3 className="font-display font-semibold text-gray-700">XP gagnés</h3>
        </div>

        {[
          { label: 'Base', value: xpBreakdown.baseXP },
          { label: 'Bonus précision', value: xpBreakdown.accuracyBonus },
          { label: 'Parfait !', value: xpBreakdown.perfectBonus },
          { label: 'Bonus du jour', value: xpBreakdown.dailyBonus },
          { label: 'Bonus série', value: xpBreakdown.streakBonus },
          { label: 'Mode accompagné', value: xpBreakdown.accompaniedBonus },
        ]
          .filter((item) => item.value > 0)
          .map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-semibold text-gold-600">+{value}</span>
            </div>
          ))}

        <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between text-sm">
          <span className="font-semibold text-gray-700">Total</span>
          <span className="font-bold text-lg text-gold-500">+{xpBreakdown.totalXP} XP</span>
        </div>
      </motion.div>

      {/* Continue Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        className="w-full py-3.5 bg-gradient-to-r from-quebec-500 to-quebec-400 text-white font-display font-semibold rounded-2xl shadow-md flex items-center justify-center gap-2"
      >
        Questions de compréhension
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  )
}
