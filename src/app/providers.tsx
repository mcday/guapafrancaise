import { useState, useEffect, useRef } from 'react'
import { useProgressStore } from '@/stores/useProgressStore'
import { checkNewBadges } from '@/services/gamification/badge-checker'
import { XPGainToast } from '@/components/gamification/XPGainToast'
import { LevelUpModal } from '@/components/gamification/LevelUpModal'
import { BadgeUnlockModal } from '@/components/gamification/BadgeUnlockModal'
import type { Level, Badge } from '@/types/progress'

export function GamificationOverlays() {
  const [xpToast, setXpToast] = useState<{ amount: number; visible: boolean }>({ amount: 0, visible: false })
  const [levelUp, setLevelUp] = useState<{ level: Level; visible: boolean } | null>(null)
  const [badgeUnlock, setBadgeUnlock] = useState<{ badge: Badge; visible: boolean } | null>(null)

  const prevXP = useRef(useProgressStore.getState().totalXP)
  const prevLevel = useRef(useProgressStore.getState().currentLevel.id)

  useEffect(() => {
    const unsub = useProgressStore.subscribe((state) => {
      // XP gain toast
      if (state.totalXP > prevXP.current) {
        const gained = state.totalXP - prevXP.current
        setXpToast({ amount: gained, visible: true })
      }

      // Level up check
      if (state.currentLevel.id > prevLevel.current) {
        setTimeout(() => {
          setLevelUp({ level: state.currentLevel, visible: true })
        }, 2000) // Delay after XP toast
      }

      // Badge check
      const newBadges = checkNewBadges()
      if (newBadges.length > 0) {
        setTimeout(() => {
          setBadgeUnlock({ badge: newBadges[0], visible: true })
        }, levelUp ? 4000 : 2500) // After level up if there is one
      }

      prevXP.current = state.totalXP
      prevLevel.current = state.currentLevel.id
    })
    return unsub
  }, [])

  return (
    <>
      <XPGainToast
        amount={xpToast.amount}
        visible={xpToast.visible}
        onDone={() => setXpToast((prev) => ({ ...prev, visible: false }))}
      />
      {levelUp && (
        <LevelUpModal
          level={levelUp.level}
          visible={levelUp.visible}
          onClose={() => setLevelUp(null)}
        />
      )}
      {badgeUnlock && (
        <BadgeUnlockModal
          badge={badgeUnlock.badge}
          visible={badgeUnlock.visible}
          onClose={() => setBadgeUnlock(null)}
        />
      )}
    </>
  )
}
