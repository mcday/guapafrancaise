import { useProgressStore } from '@/stores/useProgressStore'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { BADGES } from '@/lib/constants'
import { Flame, Trophy, Target, Star, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function ProgressPage() {
  const progress = useProgressStore()
  const { exercises } = useHistoryStore()

  return (
    <div className="px-4 py-6 lg:px-10 lg:py-8 max-w-5xl mx-auto space-y-6 lg:space-y-8">
      <h2 className="font-display text-2xl lg:text-3xl font-bold text-gray-800">Mes progrès</h2>

      {/* Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-terracotta-500 to-quebec-600 rounded-2xl p-5 text-white shadow-lg"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white/70 text-xs font-medium">Niveau {progress.currentLevel.id}</p>
            <p className="font-display text-xl font-bold">{progress.currentLevel.name}</p>
          </div>
          <div className="bg-white/20 rounded-full px-3 py-1">
            <span className="text-sm font-bold">{progress.currentLevel.cefr}</span>
          </div>
        </div>
        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold-400 rounded-full transition-all duration-700"
            style={{
              width: `${progress.currentLevel.maxXP === Infinity ? 100 : Math.round(((progress.totalXP - progress.currentLevel.minXP) / (progress.currentLevel.maxXP - progress.currentLevel.minXP)) * 100)}%`,
            }}
          />
        </div>
        <p className="text-white/70 text-xs mt-2">
          {progress.totalXP} XP{' '}
          {progress.currentLevel.maxXP !== Infinity && `/ ${progress.currentLevel.maxXP} XP`}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {[
          { icon: Flame, label: 'Meilleure série', value: `${progress.longestStreak} jours`, color: 'text-streak' },
          { icon: Trophy, label: 'Exercices', value: progress.totalExercises, color: 'text-gold-500' },
          { icon: Target, label: 'Précision dictée', value: `${progress.averageDicteeScore}%`, color: 'text-turquoise-500' },
          { icon: Star, label: 'Dictées parfaites', value: progress.perfectDictees, color: 'text-terracotta-500' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-3 shadow-sm border border-gray-50">
            <Icon className={cn('w-4 h-4 mb-1', color)} />
            <p className="text-lg font-bold text-gray-800">{value}</p>
            <p className="text-[11px] text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div>
        <h3 className="font-display font-semibold text-gray-700 mb-3">Badges</h3>
        <div className="grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3">
          {BADGES.map((badge) => {
            const unlocked = progress.unlockedBadges.includes(badge.id)
            return (
              <motion.div
                key={badge.id}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-xl text-center',
                  unlocked ? 'bg-gold-50 border border-gold-200' : 'bg-gray-50 border border-gray-100 opacity-50'
                )}
              >
                {unlocked ? (
                  <Star className="w-6 h-6 text-gold-500" />
                ) : (
                  <Lock className="w-6 h-6 text-gray-300" />
                )}
                <p className="text-[9px] font-medium text-gray-600 leading-tight">{badge.name}</p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* History */}
      {exercises.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-gray-700 mb-3">Historique récent</h3>
          <div className="space-y-2">
            {exercises.slice(0, 10).map((ex) => (
              <div key={ex.id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 shadow-sm border border-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-700">{ex.type === 'dictee' ? 'Dictée' : ex.type === 'full' ? 'Dictée + Compréhension' : 'Compréhension'}</p>
                  <p className="text-[11px] text-gray-400">{new Date(ex.date).toLocaleDateString('fr-CA')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-terracotta-500">
                    {ex.dicteeScore ?? ex.comprehensionScore ?? 0}%
                  </p>
                  <p className="text-[11px] text-gold-500 font-medium">+{ex.xpEarned} XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
