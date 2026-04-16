import { FileText, Target, User, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSettingsStore } from '@/stores/useSettingsStore'
import type { OralScenario } from '@/types/oral'

interface ScenarioCardProps {
  scenario: OralScenario
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  const { showSpanishHints } = useSettingsStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3"
    >
      {/* Situation */}
      <div className="flex items-start gap-3">
        <div className="bg-terracotta-50 rounded-lg p-2 shrink-0">
          <FileText className="w-4 h-4 text-terracotta-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 mb-1">Situation</p>
          <p className="text-sm text-gray-700 leading-relaxed">{scenario.situationFr}</p>
          {showSpanishHints && scenario.situationEs && (
            <p className="text-xs text-gray-400 mt-1 italic">{scenario.situationEs}</p>
          )}
        </div>
      </div>

      {/* Roles */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 bg-quebec-50 rounded-lg px-3 py-2">
          <Users className="w-3.5 h-3.5 text-quebec-500" />
          <div>
            <p className="text-[10px] text-quebec-400">IA joue</p>
            <p className="text-xs font-medium text-quebec-700">{scenario.roleAI}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-terracotta-50 rounded-lg px-3 py-2">
          <User className="w-3.5 h-3.5 text-terracotta-500" />
          <div>
            <p className="text-[10px] text-terracotta-400">Toi</p>
            <p className="text-xs font-medium text-terracotta-700">{scenario.roleUser}</p>
          </div>
        </div>
      </div>

      {/* Objectives */}
      <div className="flex items-start gap-3">
        <div className="bg-gold-50 rounded-lg p-2 shrink-0">
          <Target className="w-4 h-4 text-gold-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 mb-1">Objectifs</p>
          <ul className="space-y-1">
            {scenario.objectivesFr.map((obj, i) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                <span className="text-terracotta-400 mt-0.5">•</span>
                {obj}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
