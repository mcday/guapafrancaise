import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TranscriptBubbleProps {
  role: 'user' | 'ai'
  text: string
  isInterim?: boolean
}

export function TranscriptBubble({ role, text, isInterim }: TranscriptBubbleProps) {
  const isUser = role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: isInterim ? 0.6 : 1, y: 0, scale: 1 }}
      className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-terracotta-500 text-white rounded-br-md'
            : 'bg-gray-100 text-gray-800 rounded-bl-md',
          isInterim && 'italic'
        )}
      >
        {text}
      </div>
    </motion.div>
  )
}
