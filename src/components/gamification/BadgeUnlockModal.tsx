import { motion, AnimatePresence } from 'framer-motion'
import { X, Award } from 'lucide-react'
import { Alpaca } from '@/components/mascot/Alpaca'
import type { Badge } from '@/types/progress'
import { useSettingsStore } from '@/stores/useSettingsStore'

interface BadgeUnlockModalProps {
  badge: Badge | null
  visible: boolean
  onClose: () => void
}

export function BadgeUnlockModal({ badge, visible, onClose }: BadgeUnlockModalProps) {
  const showHints = useSettingsStore((s) => s.showSpanishHints)

  if (!badge) return null

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
            initial={{ scale: 0.5, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
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

            <Alpaca mood="happy" size={80} className="mx-auto" />

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="mt-3 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold-50 border-2 border-gold-300"
            >
              <Award className="w-10 h-10 text-gold-500" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-display text-xl font-bold text-gray-800 mt-3"
            >
              Badge débloqué !
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="font-display font-semibold text-terracotta-600 text-lg mt-2">
                {badge.name}
              </p>
              {showHints && (
                <p className="text-sm text-gray-400">{badge.nameEs}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">{badge.description}</p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="mt-5 w-full py-3 bg-gold-400 text-white font-medium rounded-xl"
            >
              Super !
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
