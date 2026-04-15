import { motion } from 'framer-motion'
import type { AlpacaMood } from './alpaca-moods'

interface AlpacaProps {
  mood?: AlpacaMood
  size?: number
  className?: string
}

export function Alpaca({ mood = 'idle', size = 120, className = '' }: AlpacaProps) {
  const mouthVariants: Record<AlpacaMood, string> = {
    idle: 'M37 50 Q40 53 43 50',
    happy: 'M35 49 Q40 56 45 49',
    thinking: 'M38 50.5 Q40 51.5 42 50.5',
    celebrating: 'M34 48 Q40 57 46 48',
    encouraging: 'M37 50 Q40 53 43 50',
    sleeping: 'M38 50.5 Q40 51.5 42 50.5',
  }

  const bodyAnimation = {
    idle: {
      y: [0, -3, 0],
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const },
    },
    happy: {
      y: [0, -8, 0],
      rotate: [0, -2, 2, 0],
      transition: { duration: 0.6, repeat: 2, ease: 'easeOut' as const },
    },
    thinking: {
      rotate: [0, -4, 4, -2, 0],
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const },
    },
    celebrating: {
      y: [0, -12, 0, -8, 0],
      scale: [1, 1.08, 1, 1.04, 1],
      transition: { duration: 0.5, repeat: 3, ease: 'easeOut' as const },
    },
    encouraging: {
      x: [0, -3, 3, -1, 0],
      y: [0, -2, 0],
      transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' as const },
    },
    sleeping: {
      rotate: [0, 3, 0],
      y: [0, 1, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
    },
  }

  const mouth = mouthVariants[mood]
  const isHappy = mood === 'happy' || mood === 'celebrating'
  const isSleeping = mood === 'sleeping'
  const showBlush = isHappy || mood === 'encouraging'

  // Ear wiggle
  const earAnimation = isHappy
    ? { rotate: [0, -8, 8, -4, 0], transition: { duration: 0.6, repeat: 2 } }
    : mood === 'idle'
      ? { rotate: [0, -3, 0, 3, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const } }
      : {}

  // Tail wag
  const tailAnimation = isHappy
    ? { rotate: [0, 15, -15, 10, 0], transition: { duration: 0.5, repeat: 3 } }
    : mood === 'idle'
      ? { rotate: [0, 5, -5, 0], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const } }
      : {}

  return (
    <motion.div
      className={className}
      animate={bodyAnimation[mood]}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 80 90" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        {/* Tail */}
        <motion.g animate={tailAnimation} style={{ originX: '55px', originY: '62px' }}>
          <path d="M55 62 Q62 55 60 48 Q58 52 55 55" fill="#f5dcc4" />
          <circle cx="60" cy="47" r="3" fill="#fde4d4" />
        </motion.g>

        {/* Body — fluffy wool */}
        <ellipse cx="40" cy="66" rx="17" ry="13" fill="#fde4d4" />
        <circle cx="28" cy="62" r="4" fill="#f5dcc4" />
        <circle cx="33" cy="57" r="3.5" fill="#f5dcc4" />
        <circle cx="40" cy="55" r="4" fill="#f5dcc4" />
        <circle cx="47" cy="57" r="3.5" fill="#f5dcc4" />
        <circle cx="52" cy="62" r="4" fill="#f5dcc4" />
        <circle cx="30" cy="69" r="3" fill="#f5dcc4" />
        <circle cx="50" cy="69" r="3" fill="#f5dcc4" />

        {/* Legs */}
        <rect x="28" y="74" width="4.5" height="12" rx="2.2" fill="#f0c5a0" />
        <rect x="35" y="75" width="4.5" height="11" rx="2.2" fill="#f0c5a0" />
        <rect x="42" y="75" width="4.5" height="11" rx="2.2" fill="#f0c5a0" />
        <rect x="49" y="74" width="4.5" height="12" rx="2.2" fill="#f0c5a0" />
        <rect x="28" y="84" width="4.5" height="2.5" rx="1" fill="#8b6e55" />
        <rect x="35" y="84" width="4.5" height="2.5" rx="1" fill="#8b6e55" />
        <rect x="42" y="84" width="4.5" height="2.5" rx="1" fill="#8b6e55" />
        <rect x="49" y="84" width="4.5" height="2.5" rx="1" fill="#8b6e55" />

        {/* Neck */}
        <rect x="34" y="38" width="12" height="22" rx="6" fill="#fde4d4" />
        <circle cx="34" cy="45" r="3" fill="#f5dcc4" />
        <circle cx="46" cy="45" r="3" fill="#f5dcc4" />
        <circle cx="35" cy="52" r="2.5" fill="#f5dcc4" />
        <circle cx="45" cy="52" r="2.5" fill="#f5dcc4" />

        {/* Head — big and round for cuteness */}
        <ellipse cx="40" cy="33" rx="15" ry="16" fill="#fde4d4" />

        {/* Fluffy head wool */}
        <circle cx="31" cy="21" r="4.5" fill="#f5dcc4" />
        <circle cx="40" cy="19" r="5" fill="#f5dcc4" />
        <circle cx="49" cy="21" r="4.5" fill="#f5dcc4" />
        <circle cx="35" cy="18" r="3.5" fill="#fde4d4" />
        <circle cx="45" cy="18" r="3.5" fill="#fde4d4" />

        {/* Tuque */}
        <path d="M27 22 Q30 13 40 11 Q50 13 53 22" fill="#e85d1a" />
        <rect x="27" y="20" width="26" height="4" rx="2" fill="#1e22d0" />
        <rect x="27" y="22" width="26" height="2" fill="#f9c80e" />
        <circle cx="40" cy="9" r="4" fill="#e85d1a" />

        {/* Ears — tall alpaca ears */}
        <motion.g animate={earAnimation} style={{ originX: '25px', originY: '24px' }}>
          <ellipse cx="23" cy="16" rx="3.5" ry="10" fill="#fde4d4" transform="rotate(-10 23 16)" />
          <ellipse cx="23" cy="16" rx="2" ry="7" fill="#f0b090" transform="rotate(-10 23 16)" />
        </motion.g>
        <motion.g animate={earAnimation} style={{ originX: '55px', originY: '24px' }}>
          <ellipse cx="57" cy="16" rx="3.5" ry="10" fill="#fde4d4" transform="rotate(10 57 16)" />
          <ellipse cx="57" cy="16" rx="2" ry="7" fill="#f0b090" transform="rotate(10 57 16)" />
        </motion.g>

        {/* Eyes — big round cute eyes */}
        {isSleeping ? (
          <>
            <path d="M29 37 Q33 34 37 37" fill="none" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M43 37 Q47 34 51 37" fill="none" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
          </>
        ) : isHappy ? (
          <>
            <path d="M29 37 Q33 32 37 37" fill="none" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M43 37 Q47 32 51 37" fill="none" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* Left eye */}
            <circle cx="33" cy="35" r="4.5" fill="white" />
            <circle cx="33" cy="35" r="3.5" fill="#1a1a2e" />
            <circle cx="31.5" cy="33.5" r="1.5" fill="white" />
            <circle cx="34" cy="34" r="0.7" fill="white" />
            {/* Right eye */}
            <circle cx="47" cy="35" r="4.5" fill="white" />
            <circle cx="47" cy="35" r="3.5" fill="#1a1a2e" />
            <circle cx="45.5" cy="33.5" r="1.5" fill="white" />
            <circle cx="48" cy="34" r="0.7" fill="white" />
            {/* Blink overlay — uses opacity instead of transform */}
            {mood === 'idle' && (
              <>
                <motion.rect x="28" y="30" width="11" height="10" rx="5" fill="#fde4d4"
                  animate={{ opacity: [0, 0, 1, 0, 0] }}
                  transition={{ duration: 4, repeat: Infinity, times: [0, 0.46, 0.5, 0.54, 1] }} />
                <motion.rect x="42" y="30" width="11" height="10" rx="5" fill="#fde4d4"
                  animate={{ opacity: [0, 0, 1, 0, 0] }}
                  transition={{ duration: 4, repeat: Infinity, times: [0, 0.46, 0.5, 0.54, 1] }} />
              </>
            )}
          </>
        )}

        {/* Eyelashes for cuteness */}
        {!isSleeping && !isHappy && (
          <>
            <line x1="29" y1="31" x2="27" y2="29" stroke="#1a1a2e" strokeWidth="0.8" strokeLinecap="round" />
            <line x1="30" y1="30.5" x2="29" y2="28" stroke="#1a1a2e" strokeWidth="0.8" strokeLinecap="round" />
            <line x1="51" y1="31" x2="53" y2="29" stroke="#1a1a2e" strokeWidth="0.8" strokeLinecap="round" />
            <line x1="50" y1="30.5" x2="51" y2="28" stroke="#1a1a2e" strokeWidth="0.8" strokeLinecap="round" />
          </>
        )}

        {/* Cheeks (blush) */}
        {showBlush && (
          <>
            <ellipse cx="26" cy="42" rx="4" ry="2.5" fill="#f9c5a8" opacity="0.5" />
            <ellipse cx="54" cy="42" rx="4" ry="2.5" fill="#f9c5a8" opacity="0.5" />
          </>
        )}

        {/* Nose — tiny cute alpaca nose */}
        <ellipse cx="40" cy="44" rx="2.5" ry="1.8" fill="#e8a080" />

        {/* Mouth */}
        <path d={mouth} fill="none" stroke="#1a1a2e" strokeWidth="1" strokeLinecap="round" />

        {/* Scarf */}
        <path d="M26 56 Q40 62 54 56" fill="none" stroke="#3b4ff6" strokeWidth="4" strokeLinecap="round" />
        <rect x="36" y="58" width="5" height="10" rx="2.5" fill="#3b4ff6" />
        <rect x="36" y="61" width="5" height="1.5" fill="#e85d1a" />
        <rect x="36" y="64" width="5" height="1.5" fill="#e85d1a" />

        {/* Sleeping Zzz */}
        {mood === 'sleeping' && (
          <g fontFamily="var(--font-display)" fontWeight="600">
            <motion.text x="55" y="28" fontSize="7" fill="#93aafd"
              animate={{ opacity: [0, 1, 0], y: [28, 24, 20] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}>z</motion.text>
            <motion.text x="59" y="22" fontSize="9" fill="#93aafd"
              animate={{ opacity: [0, 1, 0], y: [22, 18, 14] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>z</motion.text>
            <motion.text x="63" y="14" fontSize="11" fill="#93aafd"
              animate={{ opacity: [0, 1, 0], y: [14, 10, 6] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}>Z</motion.text>
          </g>
        )}

        {/* Celebrating particles */}
        {mood === 'celebrating' && (
          <g>
            <motion.polygon points="10,15 12,11 14,15 10,12 14,12" fill="#f9c80e"
              animate={{ scale: [0, 1.2, 0], rotate: [0, 180] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0 }} />
            <motion.polygon points="62,12 64,8 66,12 62,9 66,9" fill="#f9c80e"
              animate={{ scale: [0, 1.2, 0], rotate: [0, -180] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }} />
            <motion.circle cx="12" cy="42" r="2" fill="#e85d1a"
              animate={{ scale: [0, 1, 0], y: [0, -5] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.5 }} />
            <motion.circle cx="65" cy="38" r="2" fill="#3b4ff6"
              animate={{ scale: [0, 1, 0], y: [0, -5] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
            <motion.circle cx="18" cy="32" r="1.5" fill="#f9c80e"
              animate={{ scale: [0, 1, 0], y: [0, -5] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: 0.4 }} />
            <motion.circle cx="58" cy="28" r="1.5" fill="#e85d1a"
              animate={{ scale: [0, 1, 0], y: [0, -5] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: 0.6 }} />
          </g>
        )}

        {/* Thinking bubbles */}
        {mood === 'thinking' && (
          <g>
            <motion.circle cx="58" cy="35" r="2" fill="#93aafd"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }} />
            <motion.circle cx="63" cy="30" r="2.5" fill="#93aafd"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }} />
            <motion.circle cx="69" cy="24" r="3" fill="#93aafd"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.6 }} />
          </g>
        )}
      </svg>
    </motion.div>
  )
}
