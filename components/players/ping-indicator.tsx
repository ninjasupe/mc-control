import { getPingQuality } from '@/lib/format'
import { cn } from '@/lib/utils'

const barsByQuality = { good: 3, fair: 2, poor: 1 } as const
const colorByQuality = {
  good: 'bg-primary',
  fair: 'bg-warning',
  poor: 'bg-destructive',
} as const
const labelByQuality = { good: 'boa', fair: 'média', poor: 'ruim' } as const

export function PingIndicator({
  pingMs,
  className,
}: {
  pingMs: number
  className?: string
}) {
  const quality = getPingQuality(pingMs)
  const activeBars = barsByQuality[quality]

  return (
    <span
      className={cn(
        'flex items-center gap-1.5 text-xs tabular-nums text-muted-foreground',
        className,
      )}
      aria-label={`Ping ${pingMs} ms, conexão ${labelByQuality[quality]}`}
    >
      <span aria-hidden="true" className="flex items-end gap-px">
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={cn(
              'w-1 rounded-[1px]',
              bar === 1 && 'h-1.5',
              bar === 2 && 'h-2.5',
              bar === 3 && 'h-3.5',
              bar <= activeBars ? colorByQuality[quality] : 'bg-muted-foreground/25',
            )}
          />
        ))}
      </span>
      <span aria-hidden="true">{pingMs} ms</span>
    </span>
  )
}
