import { motion } from 'framer-motion'
import type { DiffResult } from '@/types/dictee'
import { cn } from '@/lib/utils'

interface DiffDisplayProps {
  result: DiffResult
}

export function DiffDisplay({ result }: DiffDisplayProps) {
  const { changes, stats } = result

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-gray-700">Correction</h3>
        <span
          className={cn(
            'text-lg font-bold font-display',
            stats.accuracy >= 80 ? 'text-correct' : stats.accuracy >= 50 ? 'text-gold-500' : 'text-incorrect'
          )}
        >
          {stats.accuracy}%
        </span>
      </div>

      {/* Diff text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-3 bg-gray-50 rounded-xl text-sm leading-relaxed font-mono"
      >
        {changes.map((change, i) => (
          <span
            key={i}
            className={cn(
              change.type === 'equal' && 'text-gray-700',
              change.type === 'removed' && 'bg-red-100 text-red-700 line-through',
              change.type === 'added' && 'bg-green-100 text-green-700'
            )}
          >
            {change.value}
          </span>
        ))}
      </motion.div>

      {/* Stats breakdown */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex justify-between bg-gray-50 rounded-lg px-3 py-2">
          <span className="text-gray-500">Mots corrects</span>
          <span className="font-semibold text-correct">{stats.correctWords}</span>
        </div>
        <div className="flex justify-between bg-gray-50 rounded-lg px-3 py-2">
          <span className="text-gray-500">Mots total</span>
          <span className="font-semibold text-gray-700">{stats.totalWords}</span>
        </div>
        {stats.incorrectWords > 0 && (
          <div className="flex justify-between bg-red-50 rounded-lg px-3 py-2">
            <span className="text-gray-500">Erreurs</span>
            <span className="font-semibold text-incorrect">{stats.incorrectWords}</span>
          </div>
        )}
        {stats.missingWords > 0 && (
          <div className="flex justify-between bg-amber-50 rounded-lg px-3 py-2">
            <span className="text-gray-500">Manquants</span>
            <span className="font-semibold text-missing">{stats.missingWords}</span>
          </div>
        )}
        {stats.accentErrors > 0 && (
          <div className="flex justify-between bg-orange-50 rounded-lg px-3 py-2">
            <span className="text-gray-500">Accents</span>
            <span className="font-semibold text-orange-500">{stats.accentErrors}</span>
          </div>
        )}
        {stats.extraWords > 0 && (
          <div className="flex justify-between bg-blue-50 rounded-lg px-3 py-2">
            <span className="text-gray-500">Mots en trop</span>
            <span className="font-semibold text-blue-500">{stats.extraWords}</span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-[10px] text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-100 rounded" /> Manquant/Erreur
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-100 rounded" /> Ajouté par toi
        </span>
      </div>
    </div>
  )
}
