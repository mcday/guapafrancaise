import { NavLink } from 'react-router'
import { Home, PenLine, Headphones, Mic, BarChart3, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Alpaca } from '@/components/mascot/Alpaca'

const navItems = [
  { to: '/', icon: Home, label: 'Accueil' },
  { to: '/dictee', icon: PenLine, label: 'Dictée' },
  { to: '/comprehension', icon: Headphones, label: 'Écoute' },
  { to: '/oral', icon: Mic, label: 'Oral' },
  { to: '/progress', icon: BarChart3, label: 'Progrès' },
]

const desktopNavItems = [
  ...navItems,
  { to: '/settings', icon: Settings, label: 'Réglages' },
]

export function BottomNav() {
  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-100 safe-bottom lg:hidden">
        <div className="flex items-center justify-around max-w-lg mx-auto py-1.5 px-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all text-xs font-medium',
                  isActive
                    ? 'text-terracotta-500 bg-terracotta-50'
                    : 'text-gray-400 hover:text-gray-600'
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-gray-100 flex-col z-40">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-50">
          <img src="/favicon.svg" alt="" className="w-10 h-10" />
          <div>
            <h1 className="font-display font-bold text-xl text-terracotta-600 tracking-tight leading-none">
              TEFAQ
            </h1>
            <p className="font-display text-sm text-quebec-500 font-medium">Guapa</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {desktopNavItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium',
                  isActive
                    ? 'text-terracotta-600 bg-terracotta-50 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Mascot at bottom */}
        <div className="px-5 pb-4 flex justify-center">
          <Alpaca mood="idle" size={70} />
        </div>
      </aside>
    </>
  )
}
