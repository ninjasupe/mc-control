'use client'

import { RefreshCwIcon, TriangleAlertIcon } from 'lucide-react'

import { PageHeader } from '@/components/app-shell/page-header'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { useAccount, useNotificationPreferences } from '@/hooks/use-account'

import { AccountSection } from './account-section'
import { AppInfoSection } from './app-info-section'
import { NotificationsSection } from './notifications-section'

export function SettingsScreen() {
  const account = useAccount()
  const prefs = useNotificationPreferences()

  const isLoading =
    (account.isLoading && !account.data) || (prefs.isLoading && !prefs.data)
  const error = account.error ?? prefs.error

  if (isLoading) {
    return <SettingsSkeleton />
  }

  if (error && (!account.data || !prefs.data)) {
    return (
      <SettingsError
        onRetry={() => {
          void account.mutate()
          void prefs.mutate()
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Configurações"
        description="Conta, notificações e informações do aplicativo."
      />

      {account.data && <AccountSection account={account.data} />}
      {prefs.data && <NotificationsSection preferences={prefs.data} />}
      <AppInfoSection />
    </div>
  )
}

function SettingsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Configurações" />
      <Empty className="rounded-xl border border-dashed py-10">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TriangleAlertIcon className="text-destructive" />
          </EmptyMedia>
          <EmptyTitle>Não foi possível carregar as configurações</EmptyTitle>
          <EmptyDescription>
            Verifique sua conexão e tente novamente.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={onRetry}>
            <RefreshCwIcon />
            Tentar novamente
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      {[0, 1, 2].map((section) => (
        <div key={section} className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      ))}
    </div>
  )
}
