'use client'

import { CpuIcon, MemoryStickIcon } from 'lucide-react'

import { PageHeader } from '@/components/app-shell/page-header'
import { useSelectedServer } from '@/components/providers/server-provider'
import { EmptyServers } from '@/components/shared/empty-servers'
import { ServerControls } from '@/components/servers/server-controls'
import { Skeleton } from '@/components/ui/skeleton'
import { useServer } from '@/hooks/use-servers'

import { MetricCard } from './metric-card'
import { OnlinePlayersCard } from './online-players-card'
import { RecentConsoleCard } from './recent-console-card'
import { ServerOverviewCard } from './server-overview-card'

export function DashboardScreen() {
  const { selectedServerId, selectedServer, isLoading } = useSelectedServer()
  const { data: liveServer } = useServer(selectedServerId)
  const server = liveServer ?? selectedServer

  if (isLoading && !server) {
    return <DashboardSkeleton />
  }

  if (!server) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title="Dashboard" />
        <EmptyServers />
      </div>
    )
  }

  const isOnline = server.status === 'online'
  const ramPercent =
    server.metrics.ramTotalGb > 0
      ? (server.metrics.ramUsedGb / server.metrics.ramTotalGb) * 100
      : 0

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Dashboard"
        description="Visão geral do servidor selecionado."
      />

      <ServerOverviewCard server={server} />

      <ServerControls key={server.id} server={server} />

      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Uso de CPU"
          value={isOnline ? `${server.metrics.cpuPercent}%` : '—'}
          percent={isOnline ? server.metrics.cpuPercent : 0}
          icon={CpuIcon}
          disabled={!isOnline}
        />
        <MetricCard
          label="Memória RAM"
          value={isOnline ? `${server.metrics.ramUsedGb.toFixed(1)} GB` : '—'}
          hint={`de ${server.metrics.ramTotalGb} GB`}
          percent={isOnline ? ramPercent : 0}
          icon={MemoryStickIcon}
          disabled={!isOnline}
        />
      </div>

      <RecentConsoleCard serverId={server.id} />
      <OnlinePlayersCard server={server} />
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Carregando dashboard">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-36 rounded-xl" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-52 rounded-xl" />
    </div>
  )
}
