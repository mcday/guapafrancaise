import { Link } from 'react-router'
import { PenLine, Headphones, Flame, Trophy, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { useProgressStore } from '@/stores/useProgressStore'
import { Alpaca } from '@/components/mascot/Alpaca'
import { AlpacaBubble } from '@/components/mascot/AlpacaBubble'
import { getRandomMessage } from '@/components/mascot/alpaca-moods'
import { useState, useEffect } from 'react'

export function HomePage() {
  const { currentStreak, totalXP, currentLevel, totalExercises, averageDicteeScore } = useProgressStore()
  const [message, setMessage] = useState('')

  useEffect(() => {
    setMessage(getRandomMessage('idle', 'fr'))
  }, [])

  return (
    <div className="px-4 py-6 lg:px-10 lg:py-8 max-w-5xl mx-auto space-y-6 lg:space-y-8">
      {/* Welcome + Mascot */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between gap-4"
      >
        <div className="min-w-0">
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-terracotta-700">
            Bonjour, Guapa!
          </h2>
          <p className="text-sm lg:text-base text-gray-500 mt-1">
            {currentStreak > 0
              ? `${currentStreak} jour${currentStreak > 1 ? 's' : ''} de suite !`
              : "Commence ta série aujourd'hui !"}
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 shrink-0">
          <AlpacaBubble message={message} />
          <Alpaca mood="idle" size={80} />
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 lg:gap-5">
        {[
          { icon: Flame, value: currentStreak, label: 'Série', color: 'text-streak', delay: 0.1 },
          { icon: Trophy, value: totalXP, label: 'XP total', color: 'text-gold-500', delay: 0.15 },
          { icon: Target, value: currentLevel.name, label: 'Niveau', color: 'text-turquoise-500', delay: 0.2 },
        ].map(({ icon: Icon, value, label, color, delay }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            className="bg-white rounded-2xl p-4 lg:p-5 text-center shadow-sm border border-gray-100"
          >
            <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${color} mx-auto mb-1.5`} />
            <p className="text-xl lg:text-2xl font-bold font-display text-gray-800">{value}</p>
            <p className="text-[10px] lg:text-xs text-gray-400 font-medium mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Start Buttons */}
      <div>
        <h3 className="font-display font-semibold text-gray-700 lg:text-lg mb-3">Pratiquer</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-5">
          <Link to="/dictee">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-4 bg-gradient-to-r from-terracotta-500 to-terracotta-400 text-white rounded-2xl p-5 lg:p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="bg-white/20 rounded-xl p-3">
                <PenLine className="w-6 h-6" />
              </div>
              <div>
                <p className="font-display font-semibold text-lg">Dictée</p>
                <p className="text-sm text-white/80">Écoute et écris</p>
              </div>
            </motion.div>
          </Link>
          <Link to="/comprehension">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-4 bg-gradient-to-r from-quebec-500 to-quebec-400 text-white rounded-2xl p-5 lg:p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="bg-white/20 rounded-xl p-3">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <p className="font-display font-semibold text-lg">Compréhension</p>
                <p className="text-sm text-white/80">Questions TEFAQ</p>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Recent Stats */}
      {totalExercises > 0 && (
        <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100">
          <h3 className="font-display font-semibold text-gray-700 lg:text-lg mb-4">Statistiques</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-1">Exercices</p>
              <p className="font-semibold text-gray-700 text-lg">{totalExercises}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Précision dictée</p>
              <p className="font-semibold text-gray-700 text-lg">{averageDicteeScore}%</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Meilleure série</p>
              <p className="font-semibold text-gray-700 text-lg">{useProgressStore.getState().longestStreak} jours</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Niveau actuel</p>
              <p className="font-semibold text-gray-700 text-lg">{currentLevel.cefr}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
