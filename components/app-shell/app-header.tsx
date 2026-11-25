import Link from 'next/link'

import { APP_CONFIG } from '@/lib/config'

import { BrandMark } from './brand-mark'
import { ServerSelector } from './server-selector'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 pt-safe backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-3 px-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <BrandMark />
          <span className="text-[15px] font-semibold tracking-tight">
            {APP_CONFIG.name}
          </span>
        </Link>
        <ServerSelector />
      </div>
    </header>
  )
}
