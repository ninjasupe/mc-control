import type { LucideIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string
  hint?: string
  percent: number
  icon: LucideIcon
  disabled?: boolean
}

function toneForPercent(percent: number) {
  if (percent >= 85) return 'bg-destructive'
  if (percent >= 65) return 'bg-warning'
  return 'bg-primary'
}

export function MetricCard({
  label,
  value,
  hint,
  percent,
  icon: Icon,
  disabled = false,
}: MetricCardProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)))

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {label}
          </span>
          <span
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground"
          >
            <Icon className="size-4" />
          </span>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              'text-2xl font-semibold tracking-tight tabular-nums',
              disabled && 'text-muted-foreground',
            )}
          >
            {value}
          </span>
          {hint && (
            <span className="truncate text-xs text-muted-foreground">
              {hint}
            </span>
          )}
        </div>

        <div
          role="progressbar"
          aria-label={`${label}: ${clamped}%`}
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className={cn(
              'h-full rounded-full transition-[width] duration-500 ease-out',
              disabled ? 'bg-muted-foreground/30' : toneForPercent(clamped),
            )}
            style={{ width: `${clamped}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
