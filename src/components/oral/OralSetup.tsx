import { motion } from 'framer-motion'
import { Mic, Phone, MessageSquare } from 'lucide-react'
import { TOPIC_LABELS, DIFFICULTY_LABELS } from '@/lib/constants'
import { useOralExamStore } from '@/stores/useOralExamStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { cn } from '@/lib/utils'
import type { TEFAQTopic, DifficultyLevel } from '@/types/dictee'
import type { OralSection } from '@/types/oral'

interface OralSetupProps {
  onStart: () => void
}

export function OralSetup({ onStart }: OralSetupProps) {
  const store = useOralExamStore()
  const { showSpanishHints } = useSettingsStore()

  const sections: { id: OralSection; icon: typeof Phone; labelFr: string; labelEs: string; descFr: string }[] = [
    {
      id: 'section_a',
      icon: Phone,
      labelFr: 'Section A — Obtenir des informations',
      labelEs: 'Sección A — Obtener información',
      descFr: 'Simulez un appel téléphonique (5 min, vouvoiement)',
    },
    {
      id: 'section_b',
      icon: MessageSquare,
      labelFr: 'Section B — Convaincre un(e) ami(e)',
      labelEs: 'Sección B — Convencer a un(a) amigo(a)',
      descFr: 'Persuadez un(e) ami(e) sceptique (10 min, tutoiement)',
    },
  ]

  const topics = Object.entries(TOPIC_LABELS) as [TEFAQTopic, { fr: string; es: string }][]
  const difficulties = Object.entries(DIFFICULTY_LABELS) as [DifficultyLevel, { fr: string; es: string }][]

  return (
    <div className="space-y-5">
      {/* Section Selection */}
      <div>
        <h3 className="font-display font-semibold text-gray-700 text-sm mb-2">Type d'exercice</h3>
        <div className="space-y-2">
          {sections.map(({ id, icon: Icon, labelFr, labelEs, descFr }) => (
            <motion.button
              key={id}
              whileTap={{ scale: 0.98 }}
              onClick={() => store.setSection(id)}
              className={cn(
                'w-full flex items-start gap-3 p-3 rounded-xl border-2 transition-colors text-left',
                store.section === id
                  ? 'border-terracotta-400 bg-terracotta-50'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              )}
            >
              <Icon className={cn('w-5 h-5 mt-0.5 shrink-0', store.section === id ? 'text-terracotta-500' : 'text-gray-400')} />
              <div>
                <p className={cn('text-sm font-medium', store.section === id ? 'text-terracotta-700' : 'text-gray-700')}>
                  {labelFr}
                </p>
                {showSpanishHints && (
                  <p className="text-[11px] text-gray-400">{labelEs}</p>
                )}
                <p className="text-xs text-gray-500 mt-0.5">{descFr}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Topic */}
      <div>
        <h3 className="font-display font-semibold text-gray-700 text-sm mb-2">Thème</h3>
        <div className="flex flex-wrap gap-2">
          {topics.map(([id, label]) => (
            <button
              key={id}
              onClick={() => store.setTopic(id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                store.topic === id
                  ? 'bg-terracotta-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {label.fr}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <h3 className="font-display font-semibold text-gray-700 text-sm mb-2">Niveau</h3>
        <div className="flex flex-wrap gap-2">
          {difficulties.map(([id, label]) => (
            <button
              key={id}
              onClick={() => store.setDifficulty(id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                store.difficulty === id
                  ? 'bg-quebec-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {id} — {label.fr}
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="w-full py-3.5 bg-terracotta-500 text-white font-display font-semibold rounded-2xl shadow-md hover:bg-terracotta-600 transition-colors flex items-center justify-center gap-2"
      >
        <Mic className="w-5 h-5" />
        Commencer l'oral
      </motion.button>
    </div>
  )
}
