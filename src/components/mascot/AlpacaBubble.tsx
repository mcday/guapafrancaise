import { AnimatePresence, motion } from 'framer-motion'
import { useSettingsStore } from '@/stores/useSettingsStore'

interface AlpacaBubbleProps {
  message: string
  visible?: boolean
}

export function AlpacaBubble({ message, visible = true }: AlpacaBubbleProps) {
  const showHints = useSettingsStore((s) => s.showSpanishHints)
  void showHints

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          className="relative bg-white rounded-2xl px-4 py-2.5 shadow-md max-w-[200px]
            text-sm font-body text-[#1a1a2e] border border-terracotta-100"
        >
          <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-b border-r border-terracotta-100 transform rotate-45" />
          <p className="relative z-10">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
