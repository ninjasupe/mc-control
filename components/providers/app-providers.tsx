'use client'

import { ThemeProvider } from 'next-themes'

import { Toaster } from '@/components/ui/sonner'

import { ServerProvider } from './server-provider'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <ServerProvider>{children}</ServerProvider>
      <Toaster position="top-center" />
    </ThemeProvider>
  )
}
