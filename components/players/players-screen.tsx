'use client'

import { RefreshCwIcon, TriangleAlertIcon, UsersIcon } from 'lucide-react'

import { PageHeader } from '@/components/app-shell/page-header'
import { useSelectedServer } from '@/components/providers/server-provider'
import { EmptyServers } from '@/components/shared/empty-servers'
import { ServerStatusBadge } from '@/components/shared/server-status-badge'
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
import { usePlayers } from '@/hooks/use-players'
import { useServer } from '@/hooks/use-servers'
import type { Player, Server } from '@/lib/types'

import { PlayerCard } from './player-card'

export function PlayersScreen() {
  const { selectedServerId, selectedServer, isLoading } = useSelectedServer()
  const { data: liveServer } = useServer(selectedServerId)
  const server = liveServer ?? selectedServer

  const {
    data: players,
    isLoading: isLoadingPlayers,
    error,
    mutate,
  } = usePlayers(selectedServerId)

  if (isLoading && !server) {
    return <PlayersSkeleton />
  }

  if (!server) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title="Players" />
        <EmptyServers />
      </div>
    )
  }

  const online = (players ?? []).filter((p) => p.status === 'online')
  const showSkeleton = isLoadingPlayers || (players === undefined && !error)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <PageHeader title="Players" description={server.name} />
        <ServerStatusBadge status={server.status} className="mt-1 shrink-0" />
      </div>

      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <UsersIcon className="size-4" aria-hidden="true" />
        <span className="tabular-nums">
          {showSkeleton
            ? 'Carregando jogadores...'
            : `${online.length} de ${server.maxPlayers} ${online.length === 1 ? 'jogador' : 'jogadores'} online`}
        </span>
      </p>

      {showSkeleton ? (
        <PlayerListSkeleton />
      ) : error ? (
        <PlayersError onRetry={() => mutate()} />
      ) : online.length === 0 ? (
        <NoPlayers server={server} />
      ) : (
        <PlayerList players={online} />
      )}
    </div>
  )
}

function PlayerList({ players }: { players: Player[] }) {
  return (
    <ul className="flex flex-col gap-2" aria-label="Jogadores online">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </ul>
  )
}

function NoPlayers({ server }: { server: Server }) {
  return (
    <Empty className="rounded-xl border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UsersIcon />
        </EmptyMedia>
        <EmptyTitle>Nenhum jogador online</EmptyTitle>
        <EmptyDescription>
          {server.status === 'online'
            ? 'Assim que alguém entrar no servidor, aparecerá aqui.'
            : 'O servidor está offline no momento.'}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

function PlayersError({ onRetry }: { onRetry: () => void }) {
  return (
    <Empty className="rounded-xl border border-destructive/30">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="text-destructive">
          <TriangleAlertIcon />
        </EmptyMedia>
        <EmptyTitle>Não foi possível carregar os jogadores</EmptyTitle>
        <EmptyDescription>
          Verifique a conexão com o servidor e tente novamente.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={onRetry}>
          <RefreshCwIcon data-icon="inline-start" />
          Tentar novamente
        </Button>
      </EmptyContent>
    </Empty>
  )
}

function PlayerListSkeleton() {
  return (
    <ul className="flex flex-col gap-2" aria-busy="true" aria-label="Carregando jogadores">
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index} className="flex items-center gap-3 rounded-xl border bg-card p-3">
          <Skeleton className="size-11 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
          <Skeleton className="h-4 w-14" />
        </li>
      ))}
    </ul>
  )
}

function PlayersSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-44" />
      <PlayerListSkeleton />
    </div>
  )
}
