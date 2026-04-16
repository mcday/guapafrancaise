import { motion } from 'framer-motion'
import { useSettingsStore } from '@/stores/useSettingsStore'
import type { OralEvaluation } from '@/types/oral'
import { cn } from '@/lib/utils'

interface OralEvaluationDisplayProps {
  evaluation: OralEvaluation
}

function getScoreColor(score: number, max: number) {
  const pct = (score / max) * 100
  if (pct >= 80) return 'bg-green-400'
  if (pct >= 60) return 'bg-quebec-400'
  if (pct >= 40) return 'bg-gold-400'
  return 'bg-red-400'
}

function getCEFRColor(cefr: string) {
  switch (cefr) {
    case 'C1': return 'text-green-600 bg-green-50'
    case 'B2': return 'text-quebec-600 bg-quebec-50'
    case 'B1': return 'text-gold-600 bg-gold-50'
    default: return 'text-red-600 bg-red-50'
  }
}

export function OralEvaluationDisplay({ evaluation }: OralEvaluationDisplayProps) {
  const { showSpanishHints } = useSettingsStore()

  return (
    <div className="space-y-4">
      {/* Overall Score + CEFR */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center"
      >
        <p className="text-xs text-gray-400 mb-1">Score global</p>
        <p className="text-4xl font-bold font-display text-terracotta-600">{evaluation.overallScore}%</p>
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold', getCEFRColor(evaluation.cefrEstimate))}>
            {evaluation.cefrEstimate}
          </span>
          <span className="text-xs text-gray-400">
            TEFAQ ~{evaluation.tefaqEquivalent}/20
          </span>
        </div>
      </motion.div>

      {/* Rubric Breakdown */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
        <h4 className="font-display font-semibold text-gray-700 text-sm">Évaluation par critère</h4>
        {evaluation.rubricScores.map((rubric, i) => (
          <motion.div
            key={rubric.criterionId}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-600">{rubric.criterionNameFr}</p>
              <span className="text-xs font-bold text-gray-700">{rubric.score}/{rubric.maxScore}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(rubric.score / rubric.maxScore) * 100}%` }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                className={cn('h-full rounded-full', getScoreColor(rubric.score, rubric.maxScore))}
              />
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">{rubric.feedbackFr}</p>
            {showSpanishHints && rubric.feedbackEs && (
              <p className="text-[11px] text-gray-400 italic">{rubric.feedbackEs}</p>
            )}
            {rubric.exampleBetterFr && (
              <div className="bg-quebec-50 rounded-lg px-3 py-1.5 mt-1">
                <p className="text-[11px] text-quebec-700">
                  <span className="font-medium">Exemple B2 :</span> {rubric.exampleBetterFr}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {evaluation.strengthsFr.length > 0 && (
          <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <h4 className="font-display font-semibold text-green-700 text-sm mb-2">Points forts</h4>
            <ul className="space-y-1">
              {evaluation.strengthsFr.map((s, i) => (
                <li key={i} className="text-xs text-green-700 flex items-start gap-1.5">
                  <span className="mt-0.5">+</span> {s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {evaluation.weaknessesFr.length > 0 && (
          <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
            <h4 className="font-display font-semibold text-red-700 text-sm mb-2">À améliorer</h4>
            <ul className="space-y-1">
              {evaluation.weaknessesFr.map((w, i) => (
                <li key={i} className="text-xs text-red-700 flex items-start gap-1.5">
                  <span className="mt-0.5">-</span> {w}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Improvement Tips */}
      {evaluation.improvementTipsFr.length > 0 && (
        <div className="bg-gold-50 rounded-2xl p-4 border border-gold-100">
          <h4 className="font-display font-semibold text-gold-700 text-sm mb-2">Conseils pour la prochaine fois</h4>
          <ul className="space-y-1">
            {evaluation.improvementTipsFr.map((tip, i) => (
              <li key={i} className="text-xs text-gold-700">{i + 1}. {tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Corrected Transcript */}
      {evaluation.correctedTranscriptFr && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h4 className="font-display font-semibold text-gray-700 text-sm mb-2">Transcription corrigée</h4>
          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{evaluation.correctedTranscriptFr}</p>
        </div>
      )}
    </div>
  )
}
