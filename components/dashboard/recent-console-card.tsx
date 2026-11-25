'use client'

import Link from 'next/link'
import { ChevronRightIcon, TerminalIcon } from 'lucide-react'

import { LogLine } from '@/components/console/log-line'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useLogs } from '@/hooks/use-console'

const RECENT_LINES = 5

export function RecentConsoleCard({ serverId }: { serverId: string }) {
  const { data: logs, isLoading } = useLogs(serverId, 50)
  const recent = (logs ?? []).slice(-RECENT_LINES)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TerminalIcon className="size-4 text-muted-foreground" aria-hidden="true" />
          Console recente
        </CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/console" />}
            nativeButton={false}
            className="-mr-2 text-primary"
          >
            Ver tudo
            <ChevronRightIcon data-icon="inline-end" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-0.5 rounded-lg bg-background/70 px-3 py-2.5 ring-1 ring-foreground/6">
          {isLoading && !logs
            ? Array.from({ length: RECENT_LINES }).map((_, index) => (
                <Skeleton key={index} className="my-1 h-3.5 w-full" />
              ))
            : recent.length === 0
              ? (
                <p className="py-2 text-center font-mono text-xs text-muted-foreground">
                  Nenhuma saída registrada.
                </p>
              )
              : recent.map((entry) => (
                  <LogLine key={entry.id} entry={entry} showTime={false} />
                ))}
        </div>
      </CardContent>
    </Card>
  )
}
