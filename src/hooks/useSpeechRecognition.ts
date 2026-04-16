import { useState, useCallback, useEffect } from 'react'
import { speechRecognitionService } from '@/services/speech/speech-recognition-service'
import type { SpeechInputMode } from '@/types/oral'

interface UseSpeechRecognitionReturn {
  isListening: boolean
  transcript: string
  interimTranscript: string
  error: string | null
  inputMode: SpeechInputMode
  isSupported: boolean
  startListening: (mode?: 'single' | 'continuous') => void
  stopListening: () => void
  resetTranscript: () => void
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const isSupported = speechRecognitionService.isSupported
  const inputMode: SpeechInputMode = isSupported ? 'voice' : 'text'

  useEffect(() => {
    return () => {
      speechRecognitionService.stop()
    }
  }, [])

  const startListening = useCallback((mode: 'single' | 'continuous' = 'single') => {
    setError(null)
    setInterimTranscript('')

    speechRecognitionService.start(mode, {
      onResult: (finalText, interimText) => {
        // Service always sends the full accumulated transcript — just set directly
        setTranscript(finalText)
        setInterimTranscript(interimText)
      },
      onEnd: () => {
        setIsListening(false)
        setInterimTranscript('')
      },
      onError: (err) => {
        setIsListening(false)
        setError(err)
      },
    })

    setIsListening(true)
  }, [])

  const stopListening = useCallback(() => {
    speechRecognitionService.stop()
    setIsListening(false)
    setInterimTranscript('')
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
  }, [])

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    inputMode,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  }
}
