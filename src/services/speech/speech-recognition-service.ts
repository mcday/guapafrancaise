/**
 * Web Speech API wrapper for speech-to-text
 * Language: fr-CA (Canadian French)
 * Falls back to text input on unsupported browsers
 */

type RecognitionMode = 'single' | 'continuous'

interface SpeechRecognitionCallbacks {
  /** Called with the full accumulated transcript each time results update */
  onResult?: (finalTranscript: string, interimTranscript: string) => void
  onEnd?: () => void
  onError?: (error: string) => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionInstance = any

function getSpeechRecognitionConstructor(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === 'undefined') return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

export class SpeechRecognitionService {
  private recognition: SpeechRecognitionInstance | null = null
  private _isListening = false

  get isSupported(): boolean {
    return getSpeechRecognitionConstructor() !== null
  }

  get isListening(): boolean {
    return this._isListening
  }

  start(mode: RecognitionMode, callbacks: SpeechRecognitionCallbacks = {}) {
    const Constructor = getSpeechRecognitionConstructor()
    if (!Constructor) {
      callbacks.onError?.('Speech recognition not supported in this browser')
      return
    }

    this.stop()

    this.recognition = new Constructor()
    this.recognition.lang = 'fr-CA'
    this.recognition.interimResults = true
    this.recognition.continuous = mode === 'continuous'
    this.recognition.maxAlternatives = 1

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.recognition.onresult = (event: any) => {
      // Always rebuild from ALL results (index 0) to avoid duplication
      // on mobile browsers that re-fire events for the same results
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' '
        } else {
          interimTranscript += result[0].transcript
        }
      }

      callbacks.onResult?.(finalTranscript.trim(), interimTranscript)
    }

    this.recognition.onend = () => {
      this._isListening = false
      callbacks.onEnd?.()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.recognition.onerror = (event: any) => {
      this._isListening = false
      if (event.error !== 'aborted') {
        callbacks.onError?.(event.error)
      }
    }

    this._isListening = true
    this.recognition.start()
  }

  stop() {
    if (this.recognition) {
      this.recognition.abort()
      this.recognition = null
    }
    this._isListening = false
  }
}

export const speechRecognitionService = new SpeechRecognitionService()
