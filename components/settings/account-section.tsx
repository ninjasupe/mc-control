import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import type { Account } from '@/lib/types'

import { SettingsSection } from './settings-section'

export function AccountSection({ account }: { account: Account }) {
  return (
    <SettingsSection title="Conta">
      <Item>
        <ItemMedia>
          <Avatar className="size-10 rounded-lg after:rounded-lg">
            <AvatarFallback className="rounded-lg text-sm font-semibold">
              {account.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent className="min-w-0">
          <ItemTitle className="truncate">{account.name}</ItemTitle>
          <ItemDescription className="truncate">{account.email}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="secondary">{account.plan}</Badge>
        </ItemActions>
      </Item>
    </SettingsSection>
  )
}
