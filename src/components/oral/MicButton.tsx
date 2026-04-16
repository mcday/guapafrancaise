import { Mic, MicOff, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MicButtonProps {
  isListening: boolean
  isProcessing?: boolean
  disabled?: boolean
  onClick: () => void
}

export function MicButton({ isListening, isProcessing, disabled, onClick }: MicButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={disabled || isProcessing}
      className={cn(
        'relative w-16 h-16 rounded-full flex items-center justify-center transition-colors shadow-lg',
        isListening
          ? 'bg-red-500 text-white'
          : disabled
            ? 'bg-gray-200 text-gray-400'
            : 'bg-terracotta-500 text-white hover:bg-terracotta-600'
      )}
    >
      {/* Pulsing ring when recording */}
      {isListening && (
        <motion.div
          className="absolute inset-0 rounded-full bg-red-400"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {isProcessing ? (
        <Loader2 className="w-7 h-7 animate-spin relative z-10" />
      ) : isListening ? (
        <MicOff className="w-7 h-7 relative z-10" />
      ) : (
        <Mic className="w-7 h-7 relative z-10" />
      )}
    </motion.button>
  )
}
