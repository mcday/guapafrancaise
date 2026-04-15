import { Outlet } from 'react-router'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { GamificationOverlays } from '@/app/providers'

export function AppShell() {
  return (
    <div className="min-h-dvh bg-neige">
      <BottomNav />
      <div className="lg:ml-56 min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1 pb-20 lg:pb-8">
          <Outlet />
        </main>
      </div>
      <GamificationOverlays />
    </div>
  )
}
