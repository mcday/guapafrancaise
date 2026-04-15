import { synthesizeSpeech } from './cloud-tts'

interface SpeakOptions {
  voiceURI?: string
  rate?: number
  onEnd?: () => void
  onBoundary?: (charIndex: number) => void
}

interface CloudSpeakOptions {
  rate?: number
  playbackRate?: number
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: unknown) => void
}

export class TTSService {
  private _isSpeaking = false
  private _currentAudio: HTMLAudioElement | null = null

  get isSpeaking() {
    return this._isSpeaking
  }

  getVoices(): SpeechSynthesisVoice[] {
    return speechSynthesis.getVoices().filter((v) => v.lang.startsWith('fr'))
  }

  // Browser Web Speech API (fallback)
  speak(text: string, options: SpeakOptions = {}) {
    this.stop()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'fr-CA'
    utterance.rate = options.rate ?? 0.9

    if (options.voiceURI) {
      const voice = speechSynthesis.getVoices().find((v) => v.voiceURI === options.voiceURI)
      if (voice) utterance.voice = voice
    } else {
      const voices = speechSynthesis.getVoices()
      const frCA = voices.find((v) => v.lang === 'fr-CA')
      const frFR = voices.find((v) => v.lang.startsWith('fr'))
      if (frCA) utterance.voice = frCA
      else if (frFR) utterance.voice = frFR
    }

    utterance.onstart = () => {
      this._isSpeaking = true
    }
    utterance.onend = () => {
      this._isSpeaking = false
      options.onEnd?.()
    }
    utterance.onerror = () => {
      this._isSpeaking = false
    }
    if (options.onBoundary) {
      utterance.onboundary = (e) => {
        options.onBoundary?.(e.charIndex)
      }
    }

    speechSynthesis.speak(utterance)
  }

  // Cloud TTS via Netlify function
  async speakCloud(text: string, options: CloudSpeakOptions = {}): Promise<void> {
    this.stop()

    try {
      const blobUrl = await synthesizeSpeech(text, { rate: options.rate })
      const audio = new Audio(blobUrl)
      audio.playbackRate = options.playbackRate ?? 1.0
      this._currentAudio = audio

      audio.onplay = () => {
        this._isSpeaking = true
        options.onStart?.()
      }
      audio.onended = () => {
        this._isSpeaking = false
        this._currentAudio = null
        options.onEnd?.()
      }
      audio.onerror = () => {
        this._isSpeaking = false
        this._currentAudio = null
        options.onError?.(new Error('Audio playback failed'))
      }

      await audio.play()
    } catch (err) {
      this._isSpeaking = false
      this._currentAudio = null
      options.onError?.(err)
      throw err
    }
  }

  pause() {
    if (this._currentAudio) {
      this._currentAudio.pause()
      this._isSpeaking = false
    } else {
      speechSynthesis.pause()
    }
  }

  resume() {
    if (this._currentAudio) {
      this._currentAudio.play().catch(() => {
        this._isSpeaking = false
        this._currentAudio = null
      })
      this._isSpeaking = true
    } else {
      speechSynthesis.resume()
    }
  }

  stop() {
    if (this._currentAudio) {
      this._currentAudio.pause()
      this._currentAudio.currentTime = 0
      this._currentAudio = null
    }
    speechSynthesis.cancel()
    this._isSpeaking = false
  }

  setPlaybackRate(rate: number) {
    if (this._currentAudio) {
      this._currentAudio.playbackRate = rate
    }
  }
}

export const ttsService = new TTSService()
