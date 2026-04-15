import { Flame, Sparkles } from 'lucide-react'
import { useProgressStore } from '@/stores/useProgressStore'
import { cn } from '@/lib/utils'

export function Header() {
  const { totalXP, currentLevel, currentStreak } = useProgressStore()

  const levelProgress =
    currentLevel.maxXP === Infinity
      ? 100
      : Math.round(((totalXP - currentLevel.minXP) / (currentLevel.maxXP - currentLevel.minXP)) * 100)

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-terracotta-100/50">
      <div className="flex items-center justify-between px-4 py-2.5 lg:px-8">
        {/* Logo / App name — hidden on desktop (shown in sidebar) */}
        <div className="flex items-center gap-2 lg:hidden">
          <img src="/favicon.svg" alt="" className="w-8 h-8" />
          <h1 className="font-display font-semibold text-lg text-terracotta-600 tracking-tight">
            Guapa
          </h1>
        </div>

        {/* Desktop: level name */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="font-display font-semibold text-gray-700">
            {currentLevel.name}
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {currentLevel.cefr}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 lg:gap-5">
          {/* Streak */}
          <div className={cn(
            "flex items-center gap-1.5 text-sm font-semibold",
            currentStreak > 0 ? "text-streak" : "text-gray-400"
          )}>
            <Flame className="w-4 h-4" />
            <span>{currentStreak}</span>
            <span className="hidden lg:inline text-xs font-normal text-gray-400">jours</span>
          </div>

          {/* XP + Level */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gold-50 rounded-full px-2.5 py-1">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span className="text-xs font-semibold text-gold-600">{totalXP}</span>
              <span className="hidden lg:inline text-xs font-normal text-gold-500">XP</span>
            </div>
            <div className="relative w-16 lg:w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-terracotta-400 to-quebec-500 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-quebec-600">Nv.{currentLevel.id}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
