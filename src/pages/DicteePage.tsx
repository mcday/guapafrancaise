import { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Loader2, Home, RotateCcw, PenLine } from 'lucide-react'
import { useExerciseStore } from '@/stores/useExerciseStore'
import { useProgressStore } from '@/stores/useProgressStore'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { useAI } from '@/hooks/useAI'
import { calculateDicteeXP, calculateComprehensionXP } from '@/services/diff/scoring'
import { DicteeSetup } from '@/components/dictee/DicteeSetup'
import { DicteePlayer } from '@/components/dictee/DicteePlayer'
import { DicteeScore } from '@/components/dictee/DicteeScore'
import { ManualCorrection } from '@/components/dictee/ManualCorrection'
import { QuestionSet } from '@/components/comprehension/QuestionSet'
import { Alpaca } from '@/components/mascot/Alpaca'
import { AlpacaBubble } from '@/components/mascot/AlpacaBubble'
import { getRandomMessage } from '@/components/mascot/alpaca-moods'
import { Link } from 'react-router'
import { isToday, parseISO } from 'date-fns'

export function DicteePage() {
  const store = useExerciseStore()
  const progress = useProgressStore()
  const history = useHistoryStore()
  const { loading, error, generateDictee, generateQuestions, clearError } = useAI()

  const handleStart = useCallback(async () => {
    store.setPhase('generating')
    const dictee = await generateDictee({
      topic: store.topic,
      difficulty: store.difficulty,
      sentenceCount: store.difficulty === 'A2' ? 4 : store.difficulty === 'B2' ? 6 : 5,
    })
    if (dictee) {
      store.setDictee(dictee)
      store.setPhase(store.mode === 'solo' ? 'listening' : 'writing')
    } else {
      store.setPhase('setup')
    }
  }, [store, generateDictee])

  const handleManualCorrectionComplete = useCallback(
    (errorCount: number, totalWords: number) => {
      const accuracy = totalWords > 0 ? Math.round(((totalWords - errorCount) / totalWords) * 100) : 0
      store.setDicteeScore(accuracy)
    },
    [store]
  )

  const handleContinueToQuestions = useCallback(async () => {
    if (!store.dictee) return
    store.setPhase('generating')
    const questions = await generateQuestions({
      sourceText: store.dictee.text,
      questionCount: 4,
      difficulty: store.difficulty,
      section: 'dialogue',
    })
    if (questions) {
      store.setQuestions(questions)
      store.setPhase('questions')
    } else {
      // If generation fails, go to results
      store.setPhase('results')
    }
  }, [store, generateQuestions])

  const handleQuestionsComplete = useCallback(
    (answers: Record<string, string>) => {
      const correctCount = store.questions.filter((q) => answers[q.id] === q.correctOptionId).length
      const score = Math.round((correctCount / store.questions.length) * 100)
      store.setComprehensionScore(score)

      // Calculate XP
      const isFirstToday = !progress.lastExerciseDate || !isToday(parseISO(progress.lastExerciseDate))
      const dicteeXP = store.dicteeScore !== null
        ? calculateDicteeXP(
            store.diffResult?.stats ?? { totalWords: 0, correctWords: 0, incorrectWords: 0, missingWords: 0, extraWords: 0, accentErrors: 0, accuracy: store.dicteeScore },
            store.difficulty,
            {
              isFirstToday,
              currentStreak: progress.currentStreak,
              isAccompanied: store.mode === 'accompanied',
            }
          )
        : null

      const compXP = calculateComprehensionXP(correctCount, store.questions.length, store.difficulty)
      const totalXP = (dicteeXP?.totalXP ?? 0) + compXP

      // Apply rewards
      progress.addXP(totalXP)
      progress.updateStreak()
      // Record once for the full exercise (dictée + comprehension)
      const combinedScore = store.dicteeScore !== null
        ? Math.round((store.dicteeScore + score) / 2)
        : score
      progress.recordExercise('dictee', combinedScore, store.mode)

      // Record in history
      history.addExercise({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        type: 'full',
        mode: store.mode,
        topic: store.topic,
        difficulty: store.difficulty,
        dicteeScore: store.dicteeScore,
        comprehensionScore: score,
        xpEarned: totalXP,
      })

      store.setPhase('results')
    },
    [store, progress, history]
  )

  const handleReset = useCallback(() => {
    store.resetExercise()
  }, [store])

  const dicteeXPBreakdown = store.dicteeScore !== null
    ? calculateDicteeXP(
        store.diffResult?.stats ?? { totalWords: 0, correctWords: 0, incorrectWords: 0, missingWords: 0, extraWords: 0, accentErrors: 0, accuracy: store.dicteeScore },
        store.difficulty,
        {
          isFirstToday: !progress.lastExerciseDate || !isToday(parseISO(progress.lastExerciseDate)),
          currentStreak: progress.currentStreak,
          isAccompanied: store.mode === 'accompanied',
        }
      )
    : null

  return (
    <div className="px-4 py-6 lg:px-10 lg:py-8 max-w-5xl mx-auto space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {store.exercisePhase !== 'setup' && (
            <button onClick={handleReset} aria-label="Retour" className="p-2 rounded-xl bg-gray-100 text-gray-500">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <h2 className="font-display text-xl font-bold text-terracotta-700">Dictée</h2>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600"
        >
          <p>{error}</p>
          <button onClick={clearError} className="text-red-500 underline text-xs mt-1">
            Fermer
          </button>
        </motion.div>
      )}

      {/* Phase content */}
      <AnimatePresence mode="wait">
        {store.exercisePhase === 'setup' && (
          <motion.div key="setup" exit={{ opacity: 0 }}>
            <DicteeSetup onStart={handleStart} />
          </motion.div>
        )}

        {store.exercisePhase === 'generating' && (
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
              {loading ? 'Génération en cours...' : 'Préparation...'}
            </div>
          </motion.div>
        )}

        {store.exercisePhase === 'listening' && store.dictee && (
          <motion.div key="listening" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
            <DicteePlayer text={store.dictee.text} />
            <div className="space-y-4">
              <div className="bg-terracotta-50 rounded-2xl p-5 border border-terracotta-100 text-center">
                <PenLine className="w-8 h-8 text-terracotta-400 mx-auto mb-3" />
                <p className="font-display font-semibold text-terracotta-700">
                  Écris sur papier
                </p>
                <p className="text-sm text-terracotta-500 mt-1">
                  Écoute la dictée et écris sur une feuille
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => store.setPhase('correcting')}
                className="w-full py-3.5 bg-terracotta-500 text-white font-display font-semibold rounded-2xl shadow-md hover:bg-terracotta-600 transition-colors"
              >
                C'est fait ! Corriger
              </motion.button>
            </div>
          </motion.div>
        )}

        {store.exercisePhase === 'writing' && store.mode === 'accompanied' && store.dictee && (
          <motion.div key="writing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-quebec-50 rounded-2xl p-4 border border-quebec-100 text-center">
              <Alpaca mood="idle" size={80} className="mx-auto" />
              <p className="font-display font-semibold text-quebec-700 mt-3">
                Dicte le texte à Guapa
              </p>
              <p className="text-sm text-quebec-500 mt-1">
                Elle écrit sur papier, puis tu corriges ici
              </p>
            </div>

            {/* Show the text to the partner */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
              <h3 className="font-display font-semibold text-gray-700 text-sm mb-2">Texte à dicter :</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{store.dictee.text}</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => store.setPhase('correcting')}
              className="w-full py-3.5 bg-terracotta-500 text-white font-display font-semibold rounded-2xl shadow-md"
            >
              C'est fait ! Corriger
            </motion.button>
          </motion.div>
        )}

        {store.exercisePhase === 'correcting' && store.dictee && (
          <motion.div key="correcting" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <ManualCorrection
              referenceText={store.dictee.text}
              onComplete={handleManualCorrectionComplete}
            />
            {store.dicteeScore !== null && dicteeXPBreakdown && (
              <DicteeScore
                stats={{
                  totalWords: store.dictee.text.split(/\s+/).length,
                  correctWords: store.dictee.text.split(/\s+/).length - store.manualErrors.length,
                  incorrectWords: store.manualErrors.length,
                  missingWords: 0,
                  extraWords: 0,
                  accentErrors: 0,
                  accuracy: store.dicteeScore,
                }}
                xpBreakdown={dicteeXPBreakdown}
                onContinue={handleContinueToQuestions}
              />
            )}
          </motion.div>
        )}

        {store.exercisePhase === 'questions' && store.questions.length > 0 && (
          <motion.div key="questions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            <QuestionSet
              questions={store.questions}
              onComplete={handleQuestionsComplete}
            />
          </motion.div>
        )}

        {store.exercisePhase === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 text-center"
          >
            <Alpaca mood={store.dicteeScore !== null && store.dicteeScore >= 80 ? 'celebrating' : 'happy'} size={100} className="mx-auto" />
            <h3 className="font-display text-xl font-bold text-gray-800">
              Exercice terminé !
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {store.dicteeScore !== null && (
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-50">
                  <p className="text-[11px] text-gray-400">Dictée</p>
                  <p className="text-2xl font-bold font-display text-terracotta-500">{store.dicteeScore}%</p>
                </div>
              )}
              {store.comprehensionScore !== null && (
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-50">
                  <p className="text-[11px] text-gray-400">Compréhension</p>
                  <p className="text-2xl font-bold font-display text-quebec-500">{store.comprehensionScore}%</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleReset}
                className="flex-1 py-3 bg-terracotta-500 text-white font-medium rounded-xl flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Encore
              </motion.button>
              <Link
                to="/"
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Accueil
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
