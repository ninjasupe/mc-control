import { formatTime } from '@/lib/format'
import type { LogEntry, LogLevel } from '@/lib/types'
import { cn } from '@/lib/utils'

const levelClass: Record<LogLevel, string> = {
  INFO: 'text-primary/80',
  WARN: 'text-warning',
  ERROR: 'text-destructive',
  CMD: 'text-info',
}

const messageClass: Record<LogLevel, string> = {
  INFO: 'text-foreground/90',
  WARN: 'text-warning',
  ERROR: 'text-destructive',
  CMD: 'text-info',
}

export function LogLine({
  entry,
  showTime = true,
  className,
}: {
  entry: LogEntry
  showTime?: boolean
  className?: string
}) {
  const isCommand = entry.level === 'CMD'

  return (
    <div
      className={cn(
        'flex gap-2 font-mono text-[12px] leading-5 wrap-anywhere',
        className,
      )}
    >
      {showTime && (
        <time
          dateTime={entry.timestamp}
          className="shrink-0 text-muted-foreground/70 tabular-nums"
        >
          {formatTime(entry.timestamp)}
        </time>
      )}
      <span className={cn('shrink-0 font-semibold', levelClass[entry.level])}>
        {isCommand ? '>' : `[${entry.level}]`}
      </span>
      <span className={messageClass[entry.level]}>{entry.message}</span>
    </div>
  )
}
