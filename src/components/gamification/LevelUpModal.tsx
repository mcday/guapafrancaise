import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Alpaca } from '@/components/mascot/Alpaca'
import type { Level } from '@/types/progress'
import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

interface LevelUpModalProps {
  level: Level
  visible: boolean
  onClose: () => void
}

export function LevelUpModal({ level, visible, onClose }: LevelUpModalProps) {
  const hasFireConfetti = useRef(false)

  useEffect(() => {
    if (visible && !hasFireConfetti.current) {
      hasFireConfetti.current = true
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e85d1a', '#f9c80e', '#3b4ff6', '#1dd9b4'],
      })
    }
    if (!visible) hasFireConfetti.current = false
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center relative"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>

            <Alpaca mood="celebrating" size={100} className="mx-auto" />

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-2xl font-bold text-terracotta-600 mt-4"
            >
              Niveau supérieur !
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-3"
            >
              <div className="inline-block bg-gradient-to-r from-terracotta-500 to-quebec-500 text-white px-6 py-2 rounded-full">
                <span className="text-sm opacity-80">Niveau {level.id}</span>
                <p className="font-display text-xl font-bold">{level.name}</p>
              </div>
              <p className="text-sm text-gray-400 mt-2">{level.nameEs}</p>
              <p className="text-xs text-gray-400 mt-1">CECRL : {level.cefr}</p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="mt-5 w-full py-3 bg-terracotta-500 text-white font-medium rounded-xl"
            >
              Continuer
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
