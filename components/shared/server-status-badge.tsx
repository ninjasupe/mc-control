import { Badge } from '@/components/ui/badge'
import { serverStatusLabel } from '@/lib/format'
import type { ServerStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

import { StatusDot } from './status-dot'

const classByStatus: Record<ServerStatus, string> = {
  online: 'border-primary/25 bg-primary/12 text-primary',
  offline: 'border-border bg-muted text-muted-foreground',
  starting: 'border-warning/25 bg-warning/12 text-warning',
  stopping: 'border-warning/25 bg-warning/12 text-warning',
}

export function ServerStatusBadge({
  status,
  className,
}: {
  status: ServerStatus
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn('gap-1.5 pl-2', classByStatus[status], className)}
    >
      <StatusDot status={status} className="size-1.5 [&>span]:size-1.5" />
      {serverStatusLabel[status]}
    </Badge>
  )
}
