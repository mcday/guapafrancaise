import { create } from 'zustand'
import type { DicteeContent, DiffResult, ManualError, TEFAQTopic, DifficultyLevel } from '@/types/dictee'
import type { ComprehensionQuestion } from '@/types/comprehension'
import type { ExercisePhase } from '@/types/exercise'

interface ExerciseState {
  exercisePhase: ExercisePhase
  mode: 'solo' | 'accompanied'
  topic: TEFAQTopic
  difficulty: DifficultyLevel
  dictee: DicteeContent | null
  userText: string
  diffResult: DiffResult | null
  manualErrors: ManualError[]
  dicteeScore: number | null
  questions: ComprehensionQuestion[]
  userAnswers: Record<string, string>
  comprehensionScore: number | null
  replayCount: number

  setPhase: (phase: ExercisePhase) => void
  setMode: (mode: 'solo' | 'accompanied') => void
  setTopic: (topic: TEFAQTopic) => void
  setDifficulty: (difficulty: DifficultyLevel) => void
  setDictee: (dictee: DicteeContent) => void
  setUserText: (text: string) => void
  setDiffResult: (result: DiffResult) => void
  setDicteeScore: (score: number) => void
  addManualError: (error: ManualError) => void
  removeManualError: (wordIndex: number) => void
  clearManualErrors: () => void
  setQuestions: (questions: ComprehensionQuestion[]) => void
  answerQuestion: (questionId: string, answerId: string) => void
  setComprehensionScore: (score: number) => void
  incrementReplay: () => void
  resetExercise: () => void
}

export const useExerciseStore = create<ExerciseState>()((set) => ({
  exercisePhase: 'setup',
  mode: 'solo',
  topic: 'vie_quotidienne',
  difficulty: 'B1',
  dictee: null,
  userText: '',
  diffResult: null,
  manualErrors: [],
  dicteeScore: null,
  questions: [],
  userAnswers: {},
  comprehensionScore: null,
  replayCount: 0,

  setPhase: (phase) => set({ exercisePhase: phase }),
  setMode: (mode) => set({ mode }),
  setTopic: (topic) => set({ topic }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setDictee: (dictee) => set({ dictee }),
  setUserText: (text) => set({ userText: text }),
  setDiffResult: (result) => set({ diffResult: result }),
  setDicteeScore: (score) => set({ dicteeScore: score }),
  addManualError: (error) =>
    set((s) => ({ manualErrors: [...s.manualErrors, error] })),
  removeManualError: (wordIndex) =>
    set((s) => ({ manualErrors: s.manualErrors.filter((e) => e.wordIndex !== wordIndex) })),
  clearManualErrors: () => set({ manualErrors: [] }),
  setQuestions: (questions) => set({ questions }),
  answerQuestion: (questionId, answerId) =>
    set((s) => ({ userAnswers: { ...s.userAnswers, [questionId]: answerId } })),
  setComprehensionScore: (score) => set({ comprehensionScore: score }),
  incrementReplay: () => set((s) => ({ replayCount: s.replayCount + 1 })),
  resetExercise: () =>
    set({
      exercisePhase: 'setup',
      dictee: null,
      userText: '',
      diffResult: null,
      manualErrors: [],
      dicteeScore: null,
      questions: [],
      userAnswers: {},
      comprehensionScore: null,
      replayCount: 0,
    }),
}))
