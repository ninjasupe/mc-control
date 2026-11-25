'use client'

import { useRouter } from 'next/navigation'
import {
  CheckIcon,
  CopyIcon,
  MoreHorizontalIcon,
  PencilIcon,
  SlidersHorizontalIcon,
  UsersIcon,
} from 'lucide-react'
import { toast } from 'sonner'

import { useSelectedServer } from '@/components/providers/server-provider'
import { ServerStatusBadge } from '@/components/shared/server-status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Server } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ServerCardProps {
  server: Server
  isSelected: boolean
  onRename: () => void
}

export function ServerCard({ server, isSelected, onRename }: ServerCardProps) {
  const router = useRouter()
  const { selectServer } = useSelectedServer()
  const address = `${server.address}:${server.port}`

  function manage() {
    selectServer(server.id)
    router.push('/')
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address)
      toast.success('Endereço copiado')
    } catch {
      toast.error('Não foi possível copiar o endereço')
    }
  }

  return (
    <Card className={cn(isSelected && 'border-primary/30 ring-1 ring-primary/15')}>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex min-w-0 items-center gap-2">
              <h2 className="truncate text-base font-semibold tracking-tight">
                {server.name}
              </h2>
              {isSelected && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/12 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                  <CheckIcon className="size-3" aria-hidden="true" />
                  Selecionado
                </span>
              )}
            </div>
            <div className="flex min-w-0 items-center gap-1 text-muted-foreground">
              <span className="truncate font-mono text-xs">{address}</span>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={copyAddress}
                aria-label={`Copiar endereço de ${server.name}`}
                className="text-muted-foreground"
              >
                <CopyIcon />
              </Button>
            </div>
          </div>
          <ServerStatusBadge status={server.status} />
        </div>

        <dl className="grid grid-cols-3 divide-x divide-border rounded-lg bg-background/60 ring-1 ring-foreground/6">
          <Stat label="Porta" value={String(server.port)} />
          <Stat label="Versão" value={server.version} />
          <Stat
            label="Jogadores"
            value={`${server.playersOnline} / ${server.maxPlayers}`}
            icon={<UsersIcon className="size-3" aria-hidden="true" />}
          />
        </dl>

        <div className="flex items-center gap-2">
          <Button className="flex-1" onClick={manage}>
            <SlidersHorizontalIcon data-icon="inline-start" />
            Gerenciar
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={`Mais ações para ${server.name}`}
                />
              }
            >
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44">
              <DropdownMenuItem onClick={onRename}>
                <PencilIcon />
                Renomear
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyAddress}>
                <CopyIcon />
                Copiar endereço
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-0.5 px-3 py-2.5">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="flex items-center gap-1 truncate text-sm font-semibold tabular-nums">
        {icon}
        {value}
      </dd>
    </div>
  )
}
