import { useRef, useEffect, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Square, Loader2 } from 'lucide-react'
import { TranscriptBubble } from './TranscriptBubble'
import { MicButton } from './MicButton'
import { TextInputFallback } from './TextInputFallback'
import { SpeechTimer } from './SpeechTimer'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { useOralExamStore } from '@/stores/useOralExamStore'
import { useOralAI } from '@/hooks/useOralAI'
import { ttsService } from '@/services/tts/tts-service'
import { useSettingsStore } from '@/stores/useSettingsStore'
import type { ConversationTurn } from '@/types/oral'

const SILENCE_TIMEOUT_MS = 2000

interface ConversationViewProps {
  onEnd: () => void
}

export function ConversationView({ onEnd }: ConversationViewProps) {
  const store = useOralExamStore()
  const { getAIResponse } = useOralAI()
  const { isListening, transcript, interimTranscript, startListening, stopListening, resetTranscript, inputMode } = useSpeechRecognition()
  const { ttsProvider, ttsRate } = useSettingsStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined)

  // Silence detection
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const isRecordingRef = useRef(false)
  const [isPendingSubmit, setIsPendingSubmit] = useState(false)

  // Keep refs to avoid stale closures in the silence timer
  const handleUserInputRef = useRef<(text: string) => void>(() => {})
  const stopListeningRef = useRef(stopListening)
  stopListeningRef.current = stopListening

  const scenario = store.scenario!

  // Scroll to bottom on new turns
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [store.turns.length, interimTranscript])

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  // AI speaks opening line
  useEffect(() => {
    if (store.turns.length === 0 && scenario.openingLineFr) {
      const aiTurn: ConversationTurn = {
        role: 'ai',
        text: scenario.openingLineFr,
        timestamp: Date.now(),
      }
      store.addTurn(aiTurn)
      speakText(scenario.openingLineFr)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const speakText = useCallback((text: string) => {
    store.setAISpeaking(true)
    if (ttsProvider === 'cloud') {
      ttsService.speakCloud(text, {
        rate: ttsRate,
        onEnd: () => store.setAISpeaking(false),
        onError: () => {
          store.setAISpeaking(false)
          ttsService.speak(text, { rate: ttsRate, onEnd: () => store.setAISpeaking(false) })
        },
      })
    } else {
      ttsService.speak(text, { rate: ttsRate, onEnd: () => store.setAISpeaking(false) })
    }
  }, [store, ttsProvider, ttsRate])

  const handleUserInput = useCallback(async (text: string) => {
    const userTurn: ConversationTurn = { role: 'user', text, timestamp: Date.now() }
    store.addTurn(userTurn)
    resetTranscript()

    const totalTurns = store.turns.length + 1
    if (scenario.maxTurns && totalTurns >= scenario.maxTurns) {
      onEnd()
      return
    }

    store.setAIThinking(true)
    const allTurns = [...store.turns, userTurn]
    const response = await getAIResponse({
      scenario,
      turns: allTurns,
      userLastMessage: text,
    })
    store.setAIThinking(false)

    if (response) {
      const aiTurn: ConversationTurn = { role: 'ai', text: response, timestamp: Date.now() }
      store.addTurn(aiTurn)
      speakText(response)
    }
  }, [store, scenario, getAIResponse, resetTranscript, speakText, onEnd])

  // Keep input ref in sync
  handleUserInputRef.current = handleUserInput

  // Silence detection: submit after 2s of no speech activity
  useEffect(() => {
    if (!isRecordingRef.current) return

    clearTimeout(silenceTimerRef.current)

    // If user is mid-word (interim results), don't start the timer
    if (interimTranscript) {
      setIsPendingSubmit(false)
      return
    }

    // If we have accumulated text and no interim, start the silence countdown
    if (transcript.trim()) {
      setIsPendingSubmit(true)
      silenceTimerRef.current = setTimeout(() => {
        stopListeningRef.current()
        isRecordingRef.current = false
        setIsPendingSubmit(false)
        handleUserInputRef.current(transcript.trim())
      }, SILENCE_TIMEOUT_MS)
    }

    return () => clearTimeout(silenceTimerRef.current)
  }, [transcript, interimTranscript])

  // Clean up silence timer on unmount
  useEffect(() => {
    return () => clearTimeout(silenceTimerRef.current)
  }, [])

  const handleMicToggle = useCallback(() => {
    if (isRecordingRef.current) {
      // Manual stop: submit immediately
      clearTimeout(silenceTimerRef.current)
      stopListening()
      isRecordingRef.current = false
      setIsPendingSubmit(false)
      if (transcript.trim()) {
        handleUserInput(transcript.trim())
      }
    } else {
      // Start recording in continuous mode
      resetTranscript()
      isRecordingRef.current = true
      startListening('continuous')
    }
  }, [stopListening, startListening, resetTranscript, transcript, handleUserInput])

  const handleEnd = useCallback(() => {
    clearTimeout(silenceTimerRef.current)
    if (isListening) stopListening()
    isRecordingRef.current = false
    setIsPendingSubmit(false)
    if (transcript.trim()) {
      const userTurn: ConversationTurn = { role: 'user', text: transcript.trim(), timestamp: Date.now() }
      store.addTurn(userTurn)
    }
    ttsService.stop()
    onEnd()
  }, [isListening, stopListening, transcript, store, onEnd])

  const isInputDisabled = store.isAISpeaking || store.isAIThinking
  const isRecording = isListening && isRecordingRef.current

  // Status text
  const statusText = store.isAISpeaking
    ? "L'interlocuteur parle..."
    : store.isAIThinking
      ? "L'interlocuteur réfléchit..."
      : isPendingSubmit
        ? 'Pause détectée... Envoi automatique dans 2s'
        : isRecording
          ? 'Écoute en cours... Parlez librement.'
          : 'Appuyez sur le micro pour parler'

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] lg:h-[calc(100vh-200px)]">
      <SpeechTimer elapsedSeconds={elapsedSeconds} maxSeconds={scenario.speakingTimeSeconds} />

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-3 space-y-2 min-h-0"
      >
        {store.turns.map((turn, i) => (
          <TranscriptBubble key={i} role={turn.role} text={turn.text} />
        ))}

        {/* Live transcript (interim + accumulated) */}
        {isRecording && (transcript || interimTranscript) && (
          <TranscriptBubble
            role="user"
            text={transcript + (interimTranscript ? (transcript ? ' ' : '') + interimTranscript : '')}
            isInterim
          />
        )}

        {/* AI thinking indicator */}
        {store.isAIThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-gray-400 px-2"
          >
            <Loader2 className="w-3 h-3 animate-spin" />
            L'interlocuteur réfléchit...
          </motion.div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-gray-100 pt-3 space-y-2">
        <p className={`text-xs text-center ${isPendingSubmit ? 'text-amber-500' : 'text-gray-400'}`}>
          {statusText}
        </p>

        {inputMode === 'voice' ? (
          <div className="flex items-center justify-center gap-4">
            <MicButton
              isListening={isRecording}
              isProcessing={store.isAIThinking}
              disabled={isInputDisabled}
              onClick={handleMicToggle}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleEnd}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium flex items-center gap-1.5"
            >
              <Square className="w-3.5 h-3.5" />
              Terminer
            </motion.button>
          </div>
        ) : (
          <div className="space-y-2">
            <TextInputFallback
              onSubmit={handleUserInput}
              disabled={isInputDisabled}
              placeholder="Écrivez votre réponse..."
            />
            <button
              onClick={handleEnd}
              className="w-full py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium"
            >
              Terminer la conversation
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
