import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  ListOrdered,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { ttsService } from '@/services/tts/tts-service'
import { synthesizeSpeech } from '@/services/tts/cloud-tts'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useExerciseStore } from '@/stores/useExerciseStore'
import { cn } from '@/lib/utils'

interface DicteePlayerProps {
  text: string
  onComplete?: () => void
}

const SPEED_OPTIONS = [0.7, 0.8, 0.9, 1.0] as const

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
  const [playAllMode, setPlayAllMode] = useState(false)
  const [speed, setSpeed] = useState<number>(0.9)
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false)

  const settings = useSettingsStore()
  const incrementReplay = useExerciseStore((s) => s.incrementReplay)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playAllRef = useRef(false)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ttsService.stop()
      playAllRef.current = false
    }
  }, [])

  const playSentence = useCallback(
    async (index: number) => {
      if (index < 0 || index >= sentences.length) return

      ttsService.stop()
      setCurrentIndex(index)
      setIsPlaying(true)

      const useCloud = settings.ttsProvider === 'cloud'

      const handleEnd = () => {
        setIsPlaying(false)
        audioRef.current = null

        // Auto-advance in play-all mode
        if (playAllRef.current && index < sentences.length - 1) {
          playSentence(index + 1)
        } else {
          playAllRef.current = false
          setPlayAllMode(false)
          if (index === sentences.length - 1) {
            setHasPlayedOnce(true)
            onComplete?.()
          }
        }
      }

      if (useCloud) {
        try {
          const blobUrl = await synthesizeSpeech(sentences[index])
          const audio = new Audio(blobUrl)
          audio.playbackRate = speed
          audioRef.current = audio
          audio.onended = handleEnd
          audio.onerror = () => {
            // Fall back to browser TTS
            ttsService.speak(sentences[index], {
              voiceURI: settings.ttsVoiceURI,
              rate: speed,
              onEnd: handleEnd,
            })
          }
          await audio.play()
        } catch {
          ttsService.speak(sentences[index], {
            voiceURI: settings.ttsVoiceURI,
            rate: speed,
            onEnd: handleEnd,
          })
        }
      } else {
        ttsService.speak(sentences[index], {
          voiceURI: settings.ttsVoiceURI,
          rate: speed,
          onEnd: handleEnd,
        })
      }
    },
    [sentences, settings.ttsProvider, settings.ttsVoiceURI, speed, onComplete]
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
      audioRef.current.play()
      setIsPlaying(true)
    } else {
      playSentence(currentIndex)
    }
  }, [isPlaying, currentIndex, playSentence])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      playAllRef.current = false
      setPlayAllMode(false)
      playSentence(currentIndex - 1)
    }
  }, [currentIndex, playSentence])

  const handleNext = useCallback(() => {
    if (currentIndex < sentences.length - 1) {
      playAllRef.current = false
      setPlayAllMode(false)
      playSentence(currentIndex + 1)
    }
  }, [currentIndex, sentences.length, playSentence])

  const handleRepeat = useCallback(() => {
    incrementReplay()
    playSentence(currentIndex)
  }, [currentIndex, playSentence, incrementReplay])

  const handlePlayAll = useCallback(() => {
    if (playAllMode) {
      // Stop play-all
      playAllRef.current = false
      setPlayAllMode(false)
      ttsService.stop()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setIsPlaying(false)
    } else {
      playAllRef.current = true
      setPlayAllMode(true)
      if (hasPlayedOnce) incrementReplay()
      playSentence(0)
    }
  }, [playAllMode, hasPlayedOnce, playSentence, incrementReplay])

  const handleSpeedChange = useCallback(
    (newSpeed: number) => {
      setSpeed(newSpeed)
      if (audioRef.current) {
        audioRef.current.playbackRate = newSpeed
      }
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
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              'w-1 rounded-full',
              isPlaying ? 'bg-terracotta-400' : 'bg-gray-200'
            )}
            animate={
              isPlaying
                ? {
                    height: [8, 20 + Math.random() * 20, 8],
                    transition: {
                      duration: 0.5 + Math.random() * 0.5,
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
            onClick={() => {
              playAllRef.current = false
              setPlayAllMode(false)
              playSentence(i)
            }}
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
          className={cn(
            'p-2.5 rounded-full transition-colors',
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
          className="p-2.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handlePlayPause}
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
          className={cn(
            'p-2.5 rounded-full transition-colors',
            currentIndex === sentences.length - 1
              ? 'bg-gray-50 text-gray-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          <SkipForward className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handlePlayAll}
          className={cn(
            'p-2.5 rounded-full transition-colors',
            playAllMode
              ? 'bg-terracotta-100 text-terracotta-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
          title="Lire tout"
        >
          <ListOrdered className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Speed controls */}
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
    </div>
  )
}
