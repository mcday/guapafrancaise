import { create } from 'zustand'
import type { OralExamPhase, OralSection, ConversationTurn, OralScenario, OralEvaluation } from '@/types/oral'
import type { TEFAQTopic, DifficultyLevel } from '@/types/dictee'

interface OralExamState {
  phase: OralExamPhase
  section: OralSection
  topic: TEFAQTopic
  difficulty: DifficultyLevel
  scenario: OralScenario | null
  turns: ConversationTurn[]
  isAISpeaking: boolean
  isUserSpeaking: boolean
  isAIThinking: boolean
  prepTimeRemaining: number
  speakingTimeElapsed: number
  evaluation: OralEvaluation | null

  setPhase: (phase: OralExamPhase) => void
  setSection: (section: OralSection) => void
  setTopic: (topic: TEFAQTopic) => void
  setDifficulty: (difficulty: DifficultyLevel) => void
  setScenario: (scenario: OralScenario) => void
  addTurn: (turn: ConversationTurn) => void
  setAISpeaking: (speaking: boolean) => void
  setUserSpeaking: (speaking: boolean) => void
  setAIThinking: (thinking: boolean) => void
  setPrepTimeRemaining: (seconds: number) => void
  setSpeakingTimeElapsed: (seconds: number) => void
  setEvaluation: (evaluation: OralEvaluation) => void
  resetExam: () => void
}

const initialState = {
  phase: 'setup' as OralExamPhase,
  section: 'section_a' as OralSection,
  topic: 'vie_quotidienne' as TEFAQTopic,
  difficulty: 'B1' as DifficultyLevel,
  scenario: null,
  turns: [],
  isAISpeaking: false,
  isUserSpeaking: false,
  isAIThinking: false,
  prepTimeRemaining: 0,
  speakingTimeElapsed: 0,
  evaluation: null,
}

export const useOralExamStore = create<OralExamState>()((set) => ({
  ...initialState,

  setPhase: (phase) => set({ phase }),
  setSection: (section) => set({ section }),
  setTopic: (topic) => set({ topic }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setScenario: (scenario) => set({ scenario }),
  addTurn: (turn) => set((state) => ({ turns: [...state.turns, turn] })),
  setAISpeaking: (isAISpeaking) => set({ isAISpeaking }),
  setUserSpeaking: (isUserSpeaking) => set({ isUserSpeaking }),
  setAIThinking: (isAIThinking) => set({ isAIThinking }),
  setPrepTimeRemaining: (prepTimeRemaining) => set({ prepTimeRemaining }),
  setSpeakingTimeElapsed: (speakingTimeElapsed) => set({ speakingTimeElapsed }),
  setEvaluation: (evaluation) => set({ evaluation }),
  resetExam: () => set(initialState),
}))
