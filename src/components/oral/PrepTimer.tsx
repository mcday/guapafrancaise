import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface PrepTimerProps {
  totalSeconds: number
  onComplete: () => void
}

export function PrepTimer({ totalSeconds, onComplete }: PrepTimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds)

  useEffect(() => {
    if (remaining <= 0) {
      onComplete()
      return
    }
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(timer)
  }, [remaining, onComplete])

  const progress = ((totalSeconds - remaining) / totalSeconds) * 100
  const circumference = 2 * Math.PI * 45

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm font-medium text-gray-500">Temps de préparation</p>
      <div className="relative w-28 h-28">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="6" />
          <motion.circle
            cx="50" cy="50" r="45" fill="none"
            stroke="#e07a5f" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress / 100)}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold font-display text-gray-800">{remaining}</span>
        </div>
      </div>
      <p className="text-xs text-gray-400">Lisez le scénario et préparez-vous</p>
    </div>
  )
}
