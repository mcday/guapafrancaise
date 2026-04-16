import { useState } from 'react'
import { Send } from 'lucide-react'
import { motion } from 'framer-motion'

interface TextInputFallbackProps {
  onSubmit: (text: string) => void
  disabled?: boolean
  placeholder?: string
}

export function TextInputFallback({ onSubmit, disabled, placeholder }: TextInputFallbackProps) {
  const [text, setText] = useState('')

  const handleSubmit = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex gap-2 items-end">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder ?? 'Écrivez votre réponse en français...'}
        rows={2}
        className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-300 disabled:opacity-50"
      />
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleSubmit}
        disabled={disabled || !text.trim()}
        className="p-3 rounded-xl bg-terracotta-500 text-white disabled:opacity-50 disabled:bg-gray-300 shadow-sm"
      >
        <Send className="w-4 h-4" />
      </motion.button>
    </div>
  )
}
