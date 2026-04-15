import { Users, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useExerciseStore } from '@/stores/useExerciseStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { TOPIC_LABELS, DIFFICULTY_LABELS } from '@/lib/constants'
import type { TEFAQTopic, DifficultyLevel } from '@/types/dictee'
import { cn } from '@/lib/utils'

interface DicteeSetupProps {
  onStart: () => void
}

export function DicteeSetup({ onStart }: DicteeSetupProps) {
  const { mode, topic, difficulty, setMode, setTopic, setDifficulty } = useExerciseStore()
  const showHints = useSettingsStore((s) => s.showSpanishHints)

  const topics = Object.entries(TOPIC_LABELS) as [TEFAQTopic, { fr: string; es: string }][]
  const difficulties = Object.entries(DIFFICULTY_LABELS) as [DifficultyLevel, { fr: string; es: string }][]

  return (
    <div className="space-y-5">
      {/* Mode Selection */}
      <div className="space-y-2">
        <h3 className="font-display font-semibold text-gray-700 text-sm">Mode</h3>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setMode('solo')}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all',
              mode === 'solo'
                ? 'border-terracotta-400 bg-terracotta-50 shadow-sm'
                : 'border-gray-100 bg-white hover:border-gray-200'
            )}
          >
            <User className={cn('w-6 h-6', mode === 'solo' ? 'text-terracotta-500' : 'text-gray-400')} />
            <div>
              <p className="font-medium text-sm">Solo</p>
              {showHints && <p className="text-[10px] text-gray-400">Sola</p>}
            </div>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setMode('accompanied')}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all',
              mode === 'accompanied'
                ? 'border-quebec-400 bg-quebec-50 shadow-sm'
                : 'border-gray-100 bg-white hover:border-gray-200'
            )}
          >
            <Users className={cn('w-6 h-6', mode === 'accompanied' ? 'text-quebec-500' : 'text-gray-400')} />
            <div>
              <p className="font-medium text-sm">Accompagné</p>
              {showHints && <p className="text-[10px] text-gray-400">Acompañado</p>}
            </div>
          </motion.button>
        </div>
      </div>

      {/* Topic */}
      <div className="space-y-2">
        <h3 className="font-display font-semibold text-gray-700 text-sm">Thème</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
          {topics.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTopic(key)}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-medium transition-all text-left',
                topic === key
                  ? 'bg-terracotta-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-100 hover:border-gray-200'
              )}
            >
              {label.fr}
              {showHints && <span className="block text-[9px] opacity-70">{label.es}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="space-y-2">
        <h3 className="font-display font-semibold text-gray-700 text-sm">Niveau</h3>
        <div className="flex gap-2">
          {difficulties.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setDifficulty(key)}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all',
                difficulty === key
                  ? 'bg-quebec-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-100 hover:border-gray-200'
              )}
            >
              {key}
              {showHints && <span className="block text-[9px] opacity-70">{label.es}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="w-full py-3.5 bg-gradient-to-r from-terracotta-500 to-quebec-500 text-white font-display font-semibold text-lg rounded-2xl shadow-md hover:shadow-lg transition-shadow"
      >
        Commencer
      </motion.button>
    </div>
  )
}
