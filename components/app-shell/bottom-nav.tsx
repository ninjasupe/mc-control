'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboardIcon,
  ServerIcon,
  SettingsIcon,
  TerminalIcon,
  UsersIcon,
  type LucideIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboardIcon },
  { href: '/servers', label: 'Servidores', icon: ServerIcon },
  { href: '/console', label: 'Console', icon: TerminalIcon },
  { href: '/players', label: 'Jogadores', icon: UsersIcon },
  { href: '/settings', label: 'Configurações', icon: SettingsIcon },
]

function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40"
    >
      <div className="mx-auto w-full max-w-md border-t border-border/60 bg-background/90 pb-safe backdrop-blur-md md:border-x">
        <ul className="grid h-16 grid-cols-5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActivePath(pathname, href)
            return (
              <li key={href} className="flex">
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group flex flex-1 flex-col items-center justify-center gap-1 outline-none transition-colors focus-visible:bg-muted/50',
                    active
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-7 w-12 items-center justify-center rounded-full transition-all duration-200',
                      active
                        ? 'bg-primary/14'
                        : 'group-active:scale-95 group-active:bg-muted',
                    )}
                  >
                    <Icon
                      className="size-5"
                      strokeWidth={active ? 2.4 : 2}
                      aria-hidden="true"
                    />
                  </span>
                  <span
                    className={cn(
                      'text-[11px] leading-none',
                      active ? 'font-semibold' : 'font-medium',
                    )}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
