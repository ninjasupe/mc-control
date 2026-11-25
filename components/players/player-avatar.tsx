import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Player } from '@/lib/types'
import { cn } from '@/lib/utils'

export function PlayerAvatar({
  player,
  className,
}: {
  player: Pick<Player, 'name' | 'avatarUrl'>
  className?: string
}) {
  return (
    <Avatar className={cn('rounded-lg after:rounded-lg', className)}>
      {player.avatarUrl && (
        <AvatarImage
          src={player.avatarUrl}
          alt=""
          className="rounded-lg [image-rendering:pixelated]"
        />
      )}
      <AvatarFallback className="rounded-lg bg-muted text-xs font-semibold uppercase text-muted-foreground">
        {player.name.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  )
}
