import { cn } from '@/lib/utils'
import type { ServerStatus } from '@/lib/types'

const colorByStatus: Record<ServerStatus, string> = {
  online: 'bg-primary',
  offline: 'bg-muted-foreground/50',
  starting: 'bg-warning',
  stopping: 'bg-warning',
}

export function StatusDot({
  status,
  className,
}: {
  status: ServerStatus
  className?: string
}) {
  const isLive = status === 'online'

  return (
    <span
      aria-hidden="true"
      className={cn('relative flex size-2 shrink-0', className)}
    >
      {isLive && (
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/60 [animation-duration:2.4s]" />
      )}
      <span
        className={cn('relative size-2 rounded-full', colorByStatus[status])}
      />
    </span>
  )
}
