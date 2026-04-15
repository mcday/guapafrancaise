import { motion } from 'framer-motion'
import type { AlpacaMood } from './alpaca-moods'

interface AlpacaProps {
  mood?: AlpacaMood
  size?: number
  className?: string
}

export function Alpaca({ mood = 'idle', size = 120, className = '' }: AlpacaProps) {
  const eyeVariants: Record<AlpacaMood, { left: string; right: string }> = {
    idle: { left: 'M26 30 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0', right: 'M38 30 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0' },
    happy: { left: 'M26 31 Q29 27 32 31', right: 'M38 31 Q41 27 44 31' },
    thinking: { left: 'M27 30 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0', right: 'M39 30 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0' },
    celebrating: { left: 'M26 31 Q29 26 32 31', right: 'M38 31 Q41 26 44 31' },
    encouraging: { left: 'M26 30 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0', right: 'M38 30 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0' },
    sleeping: { left: 'M26 32 Q29 30 32 32', right: 'M38 32 Q41 30 44 32' },
  }

  const mouthVariants: Record<AlpacaMood, string> = {
    idle: 'M31 40 Q35 43 39 40',
    happy: 'M29 39 Q35 46 41 39',
    thinking: 'M32 41 Q35 42 38 41',
    celebrating: 'M28 38 Q35 48 42 38',
    encouraging: 'M31 40 Q35 43 39 40',
    sleeping: 'M32 41 Q35 42 38 41',
  }

  const bodyAnimation = {
    idle: { y: [0, -2, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const } },
    happy: { y: [0, -6, 0], transition: { duration: 0.5, repeat: 2, ease: 'easeOut' as const } },
    thinking: { rotate: [0, -3, 3, 0], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const } },
    celebrating: { y: [0, -10, 0], scale: [1, 1.05, 1], transition: { duration: 0.4, repeat: 3, ease: 'easeOut' as const } },
    encouraging: { x: [0, -2, 2, 0], transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const } },
    sleeping: { rotate: [0, 2, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const } },
  }

  const eyes = eyeVariants[mood]
  const mouth = mouthVariants[mood]

  return (
    <motion.div
      className={className}
      animate={bodyAnimation[mood]}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 70 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="35" cy="62" rx="16" ry="14" fill="#fde4d4" />

        {/* Legs */}
        <rect x="22" y="70" width="5" height="10" rx="2.5" fill="#f5a070" />
        <rect x="43" y="70" width="5" height="10" rx="2.5" fill="#f5a070" />

        {/* Neck */}
        <rect x="29" y="44" width="12" height="16" rx="6" fill="#fde4d4" />

        {/* Head */}
        <ellipse cx="35" cy="32" rx="16" ry="18" fill="#fde4d4" />

        {/* Tuque */}
        <ellipse cx="35" cy="15" rx="11" ry="5" fill="#1e22d0" />
        <rect x="24" y="12" width="22" height="8" rx="2" fill="#e85d1a" />
        <rect x="24" y="15" width="22" height="3" fill="#f9c80e" />
        <circle cx="35" cy="10" r="4.5" fill="#e85d1a" />

        {/* Ears */}
        <ellipse cx="21" cy="22" rx="4" ry="9" fill="#fde4d4" transform="rotate(-15 21 22)" />
        <ellipse cx="21" cy="22" rx="2.5" ry="6" fill="#f5a070" transform="rotate(-15 21 22)" />
        <ellipse cx="49" cy="22" rx="4" ry="9" fill="#fde4d4" transform="rotate(15 49 22)" />
        <ellipse cx="49" cy="22" rx="2.5" ry="6" fill="#f5a070" transform="rotate(15 49 22)" />

        {/* Eyes */}
        <path d={eyes.left} fill="#1a1a2e" />
        <path d={eyes.right} fill="#1a1a2e" />
        {mood !== 'happy' && mood !== 'celebrating' && mood !== 'sleeping' && (
          <>
            <circle cx="30" cy="29" r="1.2" fill="white" />
            <circle cx="42" cy="29" r="1.2" fill="white" />
          </>
        )}

        {/* Cheeks (blush) */}
        {(mood === 'happy' || mood === 'celebrating') && (
          <>
            <ellipse cx="24" cy="35" rx="4" ry="2.5" fill="#f9c5a8" opacity="0.6" />
            <ellipse cx="46" cy="35" rx="4" ry="2.5" fill="#f9c5a8" opacity="0.6" />
          </>
        )}

        {/* Nose */}
        <ellipse cx="35" cy="37" rx="5" ry="3.5" fill="#f5a070" />
        <circle cx="33" cy="36.5" r="1" fill="#1a1a2e" />
        <circle cx="37" cy="36.5" r="1" fill="#1a1a2e" />

        {/* Mouth */}
        <path d={mouth} fill="none" stroke="#1a1a2e" strokeWidth="1.2" strokeLinecap="round" />

        {/* Scarf */}
        <path d="M21 48 Q35 54 49 48" fill="none" stroke="#3b4ff6" strokeWidth="4.5" strokeLinecap="round" />
        <rect x="31" y="50" width="6" height="12" rx="3" fill="#3b4ff6" />
        <rect x="31" y="53" width="6" height="2" fill="#e85d1a" />
        <rect x="31" y="57" width="6" height="2" fill="#e85d1a" />

        {/* Sleeping Zzz */}
        {mood === 'sleeping' && (
          <g fill="#93aafd" fontFamily="var(--font-display)" fontWeight="600">
            <text x="48" y="22" fontSize="8">z</text>
            <text x="52" y="16" fontSize="10">z</text>
            <text x="57" y="9" fontSize="12">Z</text>
          </g>
        )}

        {/* Celebrating stars */}
        {mood === 'celebrating' && (
          <g fill="#f9c80e">
            <polygon points="10,10 12,6 14,10 10,7 14,7" />
            <polygon points="55,8 57,4 59,8 55,5 59,5" />
            <polygon points="8,40 10,36 12,40 8,37 12,37" />
            <polygon points="58,35 60,31 62,35 58,32 62,32" />
          </g>
        )}
      </svg>
    </motion.div>
  )
}
