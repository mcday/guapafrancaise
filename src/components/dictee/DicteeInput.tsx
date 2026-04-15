import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { useExerciseStore } from '@/stores/useExerciseStore'

interface DicteeInputProps {
  onSubmit: () => void
}

export function DicteeInput({ onSubmit }: DicteeInputProps) {
  const { userText, setUserText } = useExerciseStore()
  const wordCount = userText.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 space-y-3">
      <label className="text-sm font-medium text-gray-600">
        Écris ce que tu entends
      </label>
      <textarea
        value={userText}
        onChange={(e) => setUserText(e.target.value)}
        placeholder="Commence à écrire ici..."
        className="w-full h-40 bg-gray-50 rounded-xl p-3 text-sm font-mono border border-gray-100 focus:outline-none focus:ring-2 focus:ring-terracotta-300 focus:border-transparent resize-none"
        autoFocus
        spellCheck={false}
        autoCapitalize="sentences"
      />
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-gray-400">{wordCount} mots</span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSubmit}
          disabled={!userText.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-terracotta-500 text-white font-medium text-sm rounded-xl shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-terracotta-600 transition-colors"
        >
          <Send className="w-4 h-4" />
          Vérifier
        </motion.button>
      </div>
    </div>
  )
}
