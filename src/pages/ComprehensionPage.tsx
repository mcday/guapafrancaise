import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Home, RotateCcw } from 'lucide-react'
import { Link } from 'react-router'
import { useAI } from '@/hooks/useAI'
import { useProgressStore } from '@/stores/useProgressStore'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { calculateComprehensionXP } from '@/services/diff/scoring'
import { QuestionSet } from '@/components/comprehension/QuestionSet'
import { PassagePlayer } from '@/components/comprehension/PassagePlayer'
import { Alpaca } from '@/components/mascot/Alpaca'
import { getRandomMessage } from '@/components/mascot/alpaca-moods'
import { AlpacaBubble } from '@/components/mascot/AlpacaBubble'
import { TOPIC_LABELS } from '@/lib/constants'
import type { TEFAQTopic, DifficultyLevel } from '@/types/dictee'
import type { ComprehensionQuestion } from '@/types/comprehension'
import { cn } from '@/lib/utils'

type Phase = 'setup' | 'generating' | 'listening' | 'questions' | 'results'

export function ComprehensionPage() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [topic, setTopic] = useState<TEFAQTopic>('vie_quotidienne')
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(
    useSettingsStore.getState().defaultDifficulty
  )
  const [questions, setQuestions] = useState<ComprehensionQuestion[]>([])
  const [passageText, setPassageText] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const { error, generateDictee, generateQuestions, clearError } = useAI()
  const progress = useProgressStore()
  const history = useHistoryStore()
  const showHints = useSettingsStore((s) => s.showSpanishHints)

  const handleStart = useCallback(async () => {
    setPhase('generating')
    const dictee = await generateDictee({ topic, difficulty, sentenceCount: 5 })
    if (!dictee) {
      setPhase('setup')
      return
    }

    setPassageText(dictee.text)

    const qs = await generateQuestions({
      sourceText: dictee.text,
      questionCount: 5,
      difficulty,
      section: 'dialogue',
    })
    if (qs) {
      setQuestions(qs)
      setPhase('listening')
    } else {
      setPhase('setup')
    }
  }, [topic, difficulty, generateDictee, generateQuestions])

  const handleListeningComplete = useCallback(() => {
    setPhase('questions')
  }, [])

  const handleComplete = useCallback(
    (answers: Record<string, string>) => {
      const correctCount = questions.filter((q) => answers[q.id] === q.correctOptionId).length
      const s = Math.round((correctCount / questions.length) * 100)
      setScore(s)

      const xp = calculateComprehensionXP(correctCount, questions.length, difficulty)
      progress.addXP(xp)
      progress.updateStreak()
      progress.recordExercise('comprehension', s)

      history.addExercise({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        type: 'comprehension',
        mode: 'solo',
        topic,
        difficulty,
        dicteeScore: null,
        comprehensionScore: s,
        xpEarned: xp,
      })

      setPhase('results')
    },
    [questions, difficulty, topic, progress, history]
  )

  const handleReset = () => {
    setPhase('setup')
    setQuestions([])
    setPassageText('')
    setScore(null)
  }

  const topics = Object.entries(TOPIC_LABELS) as [TEFAQTopic, { fr: string; es: string }][]

  return (
    <div className="px-4 py-6 lg:px-10 lg:py-8 max-w-5xl mx-auto space-y-5 lg:space-y-6">
      <h2 className="font-display text-xl lg:text-3xl font-bold text-quebec-700">Compréhension orale</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          <p>{error}</p>
          <button onClick={clearError} className="text-red-500 underline text-xs mt-1">Fermer</button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {phase === 'setup' && (
          <motion.div key="setup" exit={{ opacity: 0 }} className="space-y-5">
            {/* Topic */}
            <div className="space-y-2">
              <h3 className="font-display font-semibold text-gray-700 text-sm">Thème</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
                {topics.map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setTopic(key)}
                    className={cn(
                      'px-3 py-2 rounded-xl text-xs font-medium transition-all text-left',
                      topic === key
                        ? 'bg-quebec-500 text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-100 hover:border-gray-200'
                    )}
                  >
                    {label.fr}
                    {showHints && <span className="block text-[9px] opacity-70">{label.es}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <h3 className="font-display font-semibold text-gray-700 text-sm">Niveau</h3>
              <div className="flex gap-2">
                {(['A2', 'B1', 'B1+', 'B2'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={cn(
                      'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all',
                      difficulty === level
                        ? 'bg-quebec-500 text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-100'
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              className="w-full py-3.5 bg-gradient-to-r from-quebec-500 to-quebec-400 text-white font-display font-semibold text-lg rounded-2xl shadow-md"
            >
              Commencer
            </motion.button>
          </motion.div>
        )}

        {phase === 'generating' && (
          <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 py-12">
            <Alpaca mood="thinking" size={100} />
            <AlpacaBubble message={getRandomMessage('thinking')} />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Préparation des questions...
            </div>
          </motion.div>
        )}

        {phase === 'listening' && passageText && (
          <motion.div key="listening" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="flex flex-col items-center gap-3">
              <Alpaca mood="idle" size={80} />
              <AlpacaBubble message="Écoute bien le passage !" />
            </div>
            <PassagePlayer passage={passageText} onComplete={handleListeningComplete} />
          </motion.div>
        )}

        {phase === 'questions' && questions.length > 0 && (
          <motion.div key="qs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            <QuestionSet questions={questions} onComplete={handleComplete} />
          </motion.div>
        )}

        {phase === 'results' && score !== null && (
          <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 text-center">
            <Alpaca mood={score >= 80 ? 'celebrating' : score >= 50 ? 'happy' : 'encouraging'} size={100} className="mx-auto" />
            <h3 className="font-display text-xl font-bold text-gray-800">Résultat</h3>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-50 inline-block">
              <p className="text-4xl font-bold font-display text-quebec-500">{score}%</p>
              <p className="text-sm text-gray-400">Compréhension</p>
            </div>

            <div className="flex gap-3 pt-2">
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleReset}
                className="flex-1 py-3 bg-quebec-500 text-white font-medium rounded-xl flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" /> Encore
              </motion.button>
              <Link to="/" className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl flex items-center justify-center gap-2">
                <Home className="w-4 h-4" /> Accueil
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
