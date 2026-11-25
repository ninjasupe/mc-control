import { PlayerAvatar } from '@/components/players/player-avatar'
import { PingIndicator } from '@/components/players/ping-indicator'
import { Badge } from '@/components/ui/badge'
import { StatusDot } from '@/components/shared/status-dot'
import { formatRelativeMinutes } from '@/lib/format'
import type { Player } from '@/lib/types'

export function PlayerCard({ player }: { player: Player }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border bg-card p-3">
      <PlayerAvatar player={player} className="size-11 shrink-0" />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium">{player.name}</span>
          {player.isOperator && (
            <Badge
              variant="outline"
              className="h-5 shrink-0 border-primary/25 bg-primary/12 px-1.5 text-[10px] font-semibold uppercase tracking-wide text-primary"
            >
              OP
            </Badge>
          )}
        </div>
        <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <StatusDot status={player.status} className="size-1.5 [&>span]:size-1.5" />
          <span>{player.status === 'online' ? 'Online' : 'Offline'}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">entrou {formatRelativeMinutes(player.joinedAt)}</span>
        </div>
      </div>

      <PingIndicator pingMs={player.pingMs} className="shrink-0" />
    </li>
  )
}
