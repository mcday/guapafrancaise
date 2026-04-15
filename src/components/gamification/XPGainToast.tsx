import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface XPGainToastProps {
  amount: number
  visible: boolean
  onDone: () => void
}

export function XPGainToast({ amount, visible, onDone }: XPGainToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.6 }}
          transition={{ duration: 0.5 }}
          onAnimationComplete={() => {
            setTimeout(onDone, 1500)
          }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-gold-400 text-white px-5 py-2.5 rounded-full shadow-lg font-display font-bold text-lg"
        >
          <Sparkles className="w-5 h-5" />
          +{amount} XP
        </motion.div>
      )}
    </AnimatePresence>
  )
}
