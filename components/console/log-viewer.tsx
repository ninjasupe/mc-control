'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { LogEntry } from '@/lib/types'
import { cn } from '@/lib/utils'

import { LogLine } from './log-line'

const NEAR_BOTTOM_PX = 48

export function LogViewer({
  logs,
  isLoading,
  className,
}: {
  logs: LogEntry[]
  isLoading: boolean
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pinnedToBottom, setPinnedToBottom] = useState(true)
  const lastId = logs.at(-1)?.id

  useEffect(() => {
    if (pinnedToBottom && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [lastId, pinnedToBottom])

  function handleScroll() {
    const el = containerRef.current
    if (!el) return
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight
    setPinnedToBottom(distance <= NEAR_BOTTOM_PX)
  }

  function scrollToBottom() {
    setPinnedToBottom(true)
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }

  return (
    <div className={cn('relative', className)}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        aria-label="Saída do console"
        className="h-full overflow-y-auto rounded-xl bg-background/70 px-3 py-2.5 ring-1 ring-foreground/6"
      >
        {isLoading ? (
          <div className="flex flex-col gap-2 py-1">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="h-3.5 w-full" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <p className="py-6 text-center font-mono text-xs text-muted-foreground">
            Nenhuma saída registrada.
          </p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {logs.map((entry) => (
              <LogLine key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>

      {!pinnedToBottom && (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={scrollToBottom}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 shadow-md"
        >
          <ArrowDownIcon data-icon="inline-start" />
          Ir para o fim
        </Button>
      )}
    </div>
  )
}
