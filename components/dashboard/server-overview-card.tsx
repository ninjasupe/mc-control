'use client'

import { CopyIcon } from 'lucide-react'
import { toast } from 'sonner'

import { ServerStatusBadge } from '@/components/shared/server-status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatUptime } from '@/lib/format'
import type { Server } from '@/lib/types'

export function ServerOverviewCard({ server }: { server: Server }) {
  const address = `${server.address}:${server.port}`
  const isOnline = server.status === 'online'

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address)
      toast.success('Endereço copiado')
    } catch {
      toast.error('Não foi possível copiar o endereço')
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="truncate text-lg font-semibold tracking-tight">
              {server.name}
            </h2>
            <div className="flex min-w-0 items-center gap-1 text-muted-foreground">
              <span className="truncate font-mono text-xs">{address}</span>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={copyAddress}
                aria-label="Copiar endereço do servidor"
                className="text-muted-foreground"
              >
                <CopyIcon />
              </Button>
            </div>
          </div>
          <ServerStatusBadge status={server.status} />
        </div>

        <dl className="grid grid-cols-3 divide-x divide-border rounded-lg bg-background/60 ring-1 ring-foreground/6">
          <Stat
            label="Jogadores"
            value={`${server.playersOnline} / ${server.maxPlayers}`}
          />
          <Stat label="Versão" value={server.version} />
          <Stat
            label="Uptime"
            value={isOnline ? formatUptime(server.metrics.uptimeSeconds) : '—'}
          />
        </dl>
      </CardContent>
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 px-3 py-2.5">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="truncate text-sm font-semibold tabular-nums">{value}</dd>
    </div>
  )
}
