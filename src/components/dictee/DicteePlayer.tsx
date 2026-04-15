import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  Repeat,
  Timer,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { ttsService } from '@/services/tts/tts-service'
import { synthesizeSpeech, clearAudioCache } from '@/services/tts/cloud-tts'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useExerciseStore } from '@/stores/useExerciseStore'
import { cn } from '@/lib/utils'

interface DicteePlayerProps {
  text: string
  onComplete?: () => void
}

const SPEED_OPTIONS = [0.7, 0.8, 0.9, 1.0] as const
const PAUSE_OPTIONS = [
  { label: 'Sans', ms: 0 },
  { label: 'Légère', ms: 150 },
  { label: 'Moyenne', ms: 300 },
  { label: 'Longue', ms: 500 },
] as const

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

export function DicteePlayer({ text, onComplete }: DicteePlayerProps) {
  const sentences = useMemo(() => splitSentences(text), [text])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoAdvance, setAutoAdvance] = useState(false)
  const [speed, setSpeed] = useState<number>(0.9)
  const [wordPauseMs, setWordPauseMs] = useState(0)

  const settings = useSettingsStore()
  const incrementReplay = useExerciseStore((s) => s.incrementReplay)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const autoAdvanceRef = useRef(false)
  const speedRef = useRef(0.9)
  const wordPauseMsRef = useRef(0)
  const ttsProviderRef = useRef(settings.ttsProvider)
  const ttsVoiceURIRef = useRef(settings.ttsVoiceURI)

  // Stable waveform heights
  const waveHeights = useMemo(
    () => Array.from({ length: 20 }, () => ({ peak: 20 + Math.random() * 20, dur: 0.5 + Math.random() * 0.5 })),
    []
  )

  // Keep refs in sync with state
  useEffect(() => { autoAdvanceRef.current = autoAdvance }, [autoAdvance])
  useEffect(() => { speedRef.current = speed }, [speed])
  useEffect(() => { wordPauseMsRef.current = wordPauseMs }, [wordPauseMs])
  useEffect(() => { ttsProviderRef.current = settings.ttsProvider }, [settings.ttsProvider])
  useEffect(() => { ttsVoiceURIRef.current = settings.ttsVoiceURI }, [settings.ttsVoiceURI])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ttsService.stop()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const playSentence = useCallback(
    async (index: number) => {
      if (index < 0 || index >= sentences.length) return

      ttsService.stop()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      setCurrentIndex(index)
      setIsPlaying(true)

      const currentSpeed = speedRef.current
      const currentPause = wordPauseMsRef.current

      const handleEnd = () => {
        setIsPlaying(false)
        audioRef.current = null

        if (autoAdvanceRef.current && index < sentences.length - 1) {
          playSentence(index + 1)
        } else if (index === sentences.length - 1) {
          onComplete?.()
        }
      }

      if (ttsProviderRef.current === 'cloud') {
        try {
          const blobUrl = await synthesizeSpeech(sentences[index], {
            wordPauseMs: currentPause > 0 ? currentPause : undefined,
          })
          const audio = new Audio(blobUrl)
          audio.playbackRate = currentSpeed
          audioRef.current = audio
          audio.onended = handleEnd
          audio.onerror = () => {
            ttsService.speak(sentences[index], {
              voiceURI: ttsVoiceURIRef.current,
              rate: currentSpeed,
              onEnd: handleEnd,
            })
          }
          await audio.play()
        } catch {
          ttsService.speak(sentences[index], {
            voiceURI: ttsVoiceURIRef.current,
            rate: currentSpeed,
            onEnd: handleEnd,
          })
        }
      } else {
        ttsService.speak(sentences[index], {
          voiceURI: ttsVoiceURIRef.current,
          rate: currentSpeed,
          onEnd: handleEnd,
        })
      }
    },
    [sentences, onComplete]
  )

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause()
      } else {
        ttsService.pause()
      }
      setIsPlaying(false)
    } else if (audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false))
      setIsPlaying(true)
    } else {
      playSentence(currentIndex)
    }
  }, [isPlaying, currentIndex, playSentence])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      playSentence(currentIndex - 1)
    }
  }, [currentIndex, playSentence])

  const handleNext = useCallback(() => {
    if (currentIndex < sentences.length - 1) {
      playSentence(currentIndex + 1)
    }
  }, [currentIndex, sentences.length, playSentence])

  const handleRepeat = useCallback(() => {
    incrementReplay()
    playSentence(currentIndex)
  }, [currentIndex, playSentence, incrementReplay])

  const handleSpeedChange = useCallback(
    (newSpeed: number) => {
      setSpeed(newSpeed)
      speedRef.current = newSpeed
      if (audioRef.current) {
        audioRef.current.playbackRate = newSpeed
      }
    },
    []
  )

  const handlePauseChange = useCallback(
    (ms: number) => {
      setWordPauseMs(ms)
      wordPauseMsRef.current = ms
      clearAudioCache()
    },
    []
  )

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Volume2 className="w-4 h-4" />
          <span>Écoute attentivement</span>
        </div>
        <span className="text-xs font-medium text-gray-400">
          Phrase {currentIndex + 1}/{sentences.length}
        </span>
      </div>

      {/* Waveform */}
      <div className="flex items-center justify-center gap-1 h-12">
        {waveHeights.map((w, i) => (
          <motion.div
            key={i}
            className={cn(
              'w-1 rounded-full',
              isPlaying ? 'bg-terracotta-400' : 'bg-gray-200'
            )}
            animate={
              isPlaying
                ? {
                    height: [8, w.peak, 8],
                    transition: {
                      duration: w.dur,
                      repeat: Infinity,
                      delay: i * 0.05,
                    },
                  }
                : { height: 8 + Math.sin(i * 0.5) * 4 }
            }
          />
        ))}
      </div>

      {/* Sentence dots */}
      <div className="flex items-center justify-center gap-1.5">
        {sentences.map((_, i) => (
          <button
            key={i}
            onClick={() => playSentence(i)}
            aria-label={`Phrase ${i + 1}`}
            aria-current={i === currentIndex ? 'true' : undefined}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              i === currentIndex
                ? 'bg-terracotta-500 scale-125'
                : i < currentIndex
                  ? 'bg-terracotta-200'
                  : 'bg-gray-200'
            )}
          />
        ))}
      </div>

      {/* Transport controls */}
      <div className="flex items-center justify-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          disabled={currentIndex === 0}
          aria-label="Phrase précédente"
          className={cn(
            'p-3 rounded-full transition-colors',
            currentIndex === 0
              ? 'bg-gray-50 text-gray-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          <SkipBack className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleRepeat}
          aria-label="Répéter"
          className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handlePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Lecture'}
          className="p-4 rounded-full bg-gradient-to-r from-terracotta-500 to-terracotta-400 text-white shadow-md hover:shadow-lg transition-shadow"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          disabled={currentIndex === sentences.length - 1}
          aria-label="Phrase suivante"
          className={cn(
            'p-3 rounded-full transition-colors',
            currentIndex === sentences.length - 1
              ? 'bg-gray-50 text-gray-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          <SkipForward className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setAutoAdvance(!autoAdvance)}
          aria-label={autoAdvance ? 'Lecture continue activée' : 'Lecture continue désactivée'}
          className={cn(
            'p-3 rounded-full transition-colors',
            autoAdvance
              ? 'bg-terracotta-100 text-terracotta-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          <Repeat className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Speed controls */}
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-1.5">
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSpeedChange(s)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                speed === s
                  ? 'bg-terracotta-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              )}
            >
              {s.toFixed(1)}x
            </button>
          ))}
        </div>

        {/* Word pause controls */}
        <div className="flex items-center justify-center gap-1.5">
          <Timer className="w-3 h-3 text-gray-400 mr-0.5" />
          {PAUSE_OPTIONS.map((p) => (
            <button
              key={p.ms}
              onClick={() => handlePauseChange(p.ms)}
              className={cn(
                'px-2 py-1 rounded-lg text-[11px] font-medium transition-all',
                wordPauseMs === p.ms
                  ? 'bg-quebec-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
