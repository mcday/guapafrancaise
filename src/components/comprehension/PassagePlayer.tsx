import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { Play, Pause, Headphones, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { ttsService } from '@/services/tts/tts-service'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { cn } from '@/lib/utils'

interface PassagePlayerProps {
  passage: string
  onComplete: () => void
}

const MAX_LISTENS = 2

export function PassagePlayer({ passage, onComplete }: PassagePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [listenCount, setListenCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const playingRef = useRef(false)
  const settings = useSettingsStore()

  const play = useCallback(async () => {
    if (playingRef.current || listenCount >= MAX_LISTENS) return
    playingRef.current = true
    setIsPlaying(true)
    setHasStarted(true)

    const useCloud = settings.ttsProvider === 'cloud'

    const onEnd = () => {
      playingRef.current = false
      setIsPlaying(false)
      setListenCount((c) => c + 1)
    }

    if (useCloud) {
      try {
        await ttsService.speakCloud(passage, {
          playbackRate: settings.ttsRate,
          onEnd,
          onError: () => {
            // Fall back to browser TTS on cloud error
            ttsService.speak(passage, {
              voiceURI: settings.ttsVoiceURI,
              rate: settings.ttsRate,
              onEnd,
            })
          },
        })
      } catch {
        ttsService.speak(passage, {
          voiceURI: settings.ttsVoiceURI,
          rate: settings.ttsRate,
          onEnd,
        })
      }
    } else {
      ttsService.speak(passage, {
        voiceURI: settings.ttsVoiceURI,
        rate: settings.ttsRate,
        onEnd,
      })
    }
  }, [passage, listenCount, settings.ttsProvider, settings.ttsRate, settings.ttsVoiceURI])

  const togglePause = useCallback(() => {
    if (isPlaying) {
      ttsService.pause()
      setIsPlaying(false)
      playingRef.current = false
    } else {
      ttsService.resume()
      setIsPlaying(true)
      playingRef.current = true
    }
  }, [isPlaying])

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      ttsService.stop()
    }
  }, [])

  // Stable waveform heights
  const waveHeights = useMemo(
    () => Array.from({ length: 20 }, () => ({ peak: 20 + Math.random() * 20, dur: 0.5 + Math.random() * 0.5 })),
    []
  )

  const canListen = listenCount < MAX_LISTENS
  const hasListenedOnce = listenCount >= 1

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Headphones className="w-4 h-4" />
          <span>Écoute le passage attentivement</span>
        </div>

        {/* Waveform */}
        <div className="flex items-center justify-center gap-1 h-12">
          {waveHeights.map((w, i) => (
            <motion.div
              key={i}
              className={cn(
                'w-1 rounded-full',
                isPlaying ? 'bg-quebec-400' : 'bg-gray-200'
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

        {/* Listen counter */}
        <p className="text-center text-sm font-medium text-gray-600">
          {listenCount < MAX_LISTENS
            ? `Écoute ${listenCount + 1}/${MAX_LISTENS}`
            : 'Écoutes terminées'}
        </p>

        {/* Play/Pause button */}
        <div className="flex justify-center">
          {canListen ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={isPlaying ? togglePause : play}
              aria-label={isPlaying ? 'Pause' : 'Lecture'}
              className="p-4 rounded-full bg-gradient-to-r from-quebec-500 to-quebec-400 text-white shadow-md hover:shadow-lg transition-shadow"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </motion.button>
          ) : (
            <div className="p-4 rounded-full bg-gray-100 text-gray-400">
              <Play className="w-6 h-6 ml-0.5" />
            </div>
          )}
        </div>

        {!hasStarted && (
          <p className="text-center text-xs text-gray-400">
            Appuie sur lecture pour écouter le passage
          </p>
        )}
      </div>

      {/* Proceed button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onComplete}
        disabled={!hasListenedOnce}
        className={cn(
          'w-full py-3.5 font-display font-semibold text-lg rounded-2xl flex items-center justify-center gap-2 transition-all',
          hasListenedOnce
            ? 'bg-gradient-to-r from-quebec-500 to-quebec-400 text-white shadow-md'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        )}
      >
        Commencer les questions
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  )
}
