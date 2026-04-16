import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useOralExamStore } from '@/stores/useOralExamStore'
import { useProgressStore } from '@/stores/useProgressStore'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { useOralAI } from '@/hooks/useOralAI'
import { calculateOralXP } from '@/services/diff/scoring'
import { checkNewBadges } from '@/services/gamification/badge-checker'
import { OralSetup } from '@/components/oral/OralSetup'
import { ScenarioCard } from '@/components/oral/ScenarioCard'
import { PrepTimer } from '@/components/oral/PrepTimer'
import { ConversationView } from '@/components/oral/ConversationView'
import { MonologueView } from '@/components/oral/MonologueView'
import { OralResults } from '@/components/oral/OralResults'
import { Alpaca } from '@/components/mascot/Alpaca'
import { AlpacaBubble } from '@/components/mascot/AlpacaBubble'
import { getRandomMessage } from '@/components/mascot/alpaca-moods'
import { ttsService } from '@/services/tts/tts-service'

export function OralExamPage() {
  const store = useOralExamStore()
  const progress = useProgressStore()
  const history = useHistoryStore()
  const { loading, error, generateScenario, evaluatePerformance, clearError } = useOralAI()
  const [xpEarned, setXpEarned] = useState(0)

  const handleStart = useCallback(async () => {
    store.setPhase('generating')
    const scenario = await generateScenario({
      section: store.section,
      topic: store.topic,
      difficulty: store.difficulty,
    })
    if (scenario) {
      store.setScenario(scenario)
      store.setPhase('preparation')
    } else {
      store.setPhase('setup')
    }
  }, [store, generateScenario])

  const handlePrepDone = useCallback(() => {
    store.setPhase('speaking')
  }, [store])

  const handleConversationEnd = useCallback(async () => {
    // Stop any ongoing audio
    ttsService.stop()

    store.setPhase('evaluating')
    const evaluation = await evaluatePerformance({
      section: store.section,
      scenario: store.scenario!,
      turns: store.turns,
    })

    if (evaluation) {
      store.setEvaluation(evaluation)

      // Calculate XP
      const xp = calculateOralXP(evaluation.overallScore, store.difficulty)
      setXpEarned(xp)

      // Apply rewards
      progress.addXP(xp)
      progress.updateStreak()
      progress.recordExercise('oral', evaluation.overallScore)

      // Record in history
      history.addExercise({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        type: store.section === 'section_a' ? 'oral_a' : 'oral_b',
        mode: 'solo',
        topic: store.topic,
        difficulty: store.difficulty,
        dicteeScore: null,
        comprehensionScore: null,
        oralScore: evaluation.overallScore,
        xpEarned: xp,
      })

      // Check badges
      checkNewBadges()

      store.setPhase('results')
    } else {
      // If evaluation fails, still go to results with what we have
      store.setPhase('results')
    }
  }, [store, evaluatePerformance, progress, history])

  const handleReset = useCallback(() => {
    ttsService.stop()
    store.resetExam()
    setXpEarned(0)
  }, [store])

  return (
    <div className="px-4 py-6 lg:px-10 lg:py-8 max-w-5xl mx-auto space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {store.phase !== 'setup' && (
            <button onClick={handleReset} aria-label="Retour" className="p-2 rounded-xl bg-gray-100 text-gray-500">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <h2 className="font-display text-xl font-bold text-terracotta-700">Expression orale</h2>
        </div>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600"
        >
          <p>{error}</p>
          <button onClick={clearError} className="text-red-500 underline text-xs mt-1">Fermer</button>
        </motion.div>
      )}

      {/* Phase content */}
      <AnimatePresence mode="wait">
        {store.phase === 'setup' && (
          <motion.div key="setup" exit={{ opacity: 0 }}>
            <OralSetup onStart={handleStart} />
          </motion.div>
        )}

        {store.phase === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 py-12"
          >
            <Alpaca mood="thinking" size={100} />
            <AlpacaBubble message={getRandomMessage('thinking')} />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              {loading ? 'Création du scénario...' : 'Préparation...'}
            </div>
          </motion.div>
        )}

        {store.phase === 'preparation' && store.scenario && (
          <motion.div
            key="preparation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <ScenarioCard scenario={store.scenario} />
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center">
              <PrepTimer totalSeconds={store.scenario.prepTimeSeconds} onComplete={handlePrepDone} />
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handlePrepDone}
              className="w-full py-3 bg-terracotta-500 text-white font-display font-semibold rounded-2xl shadow-md"
            >
              Je suis prêt(e) — Commencer
            </motion.button>
          </motion.div>
        )}

        {store.phase === 'speaking' && store.scenario && (
          <motion.div
            key="speaking"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            {store.section === 'section_a' ? (
              <ConversationView onEnd={handleConversationEnd} />
            ) : (
              <MonologueView onEnd={handleConversationEnd} />
            )}
          </motion.div>
        )}

        {store.phase === 'evaluating' && (
          <motion.div
            key="evaluating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 py-12"
          >
            <Alpaca mood="thinking" size={100} />
            <AlpacaBubble message="J'analyse ta performance..." />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Évaluation en cours...
            </div>
          </motion.div>
        )}

        {store.phase === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {store.evaluation ? (
              <OralResults
                evaluation={store.evaluation}
                xpEarned={xpEarned}
                onRestart={handleReset}
              />
            ) : (
              <div className="text-center space-y-4 py-8">
                <Alpaca mood="encouraging" size={90} className="mx-auto" />
                <h3 className="font-display text-xl font-bold text-gray-800">
                  Évaluation indisponible
                </h3>
                <p className="text-sm text-gray-500">
                  L'évaluation n'a pas pu être générée. Réessaie !
                </p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleReset}
                  className="px-6 py-3 bg-terracotta-500 text-white font-medium rounded-xl"
                >
                  Recommencer
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
