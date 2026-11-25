import { AppHeader } from '@/components/app-shell/app-header'
import { BottomNav } from '@/components/app-shell/bottom-nav'

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background md:border-x md:border-border">
      <AppHeader />
      <main className="flex-1 px-4 pt-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
