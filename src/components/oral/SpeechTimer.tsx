import { Timer } from 'lucide-react'

interface SpeechTimerProps {
  elapsedSeconds: number
  maxSeconds: number
}

export function SpeechTimer({ elapsedSeconds, maxSeconds }: SpeechTimerProps) {
  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60
  const progress = Math.min((elapsedSeconds / maxSeconds) * 100, 100)
  const isNearEnd = elapsedSeconds > maxSeconds * 0.8

  return (
    <div className="flex items-center gap-2">
      <Timer className={`w-4 h-4 ${isNearEnd ? 'text-red-500' : 'text-gray-400'}`} />
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isNearEnd ? 'bg-red-400' : 'bg-terracotta-400'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className={`text-xs font-mono font-medium ${isNearEnd ? 'text-red-500' : 'text-gray-500'}`}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  )
}
