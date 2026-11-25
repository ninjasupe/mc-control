'use client'

import Link from 'next/link'
import { ChevronRightIcon, UsersIcon } from 'lucide-react'

import { PlayerAvatar } from '@/components/players/player-avatar'
import { PingIndicator } from '@/components/players/ping-indicator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePlayers } from '@/hooks/use-players'
import type { Server } from '@/lib/types'

const MAX_VISIBLE = 4

export function OnlinePlayersCard({ server }: { server: Server }) {
  const { data: players, isLoading } = usePlayers(server.id)
  const online = (players ?? []).filter((p) => p.status === 'online')
  const visible = online.slice(0, MAX_VISIBLE)
  const remaining = online.length - visible.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersIcon className="size-4 text-muted-foreground" aria-hidden="true" />
          Jogadores online
          {online.length > 0 && (
            <Badge variant="secondary" className="tabular-nums">
              {online.length}
            </Badge>
          )}
        </CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/players" />}
            nativeButton={false}
            className="-mr-2 text-primary"
          >
            Ver todos
            <ChevronRightIcon data-icon="inline-end" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoading && !players ? (
          <ul className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <li key={index} className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-lg" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="ml-auto h-4 w-12" />
              </li>
            ))}
          </ul>
        ) : online.length === 0 ? (
          <p className="py-2 text-center text-sm text-muted-foreground">
            {server.status === 'online'
              ? 'Nenhum jogador conectado no momento.'
              : 'O servidor está offline.'}
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border/70">
            {visible.map((player) => (
              <li
                key={player.id}
                className="flex items-center gap-3 py-2 first:pt-0 last:pb-0"
              >
                <PlayerAvatar player={player} className="size-9" />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">
                    {player.name}
                    {player.isOperator && (
                      <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                        OP
                      </span>
                    )}
                  </span>
                </span>
                <PingIndicator pingMs={player.pingMs} />
              </li>
            ))}
            {remaining > 0 && (
              <li className="pt-2 text-center text-xs text-muted-foreground">
                + {remaining} {remaining === 1 ? 'jogador' : 'jogadores'}
              </li>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
