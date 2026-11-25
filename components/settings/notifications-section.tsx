'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { useUpdateNotificationPreferences } from '@/hooks/use-account'
import type { NotificationPreferences } from '@/lib/types'

import { SettingsSection } from './settings-section'

type PreferenceKey = keyof NotificationPreferences

const PREFERENCE_OPTIONS: {
  key: PreferenceKey
  title: string
  description: string
}[] = [
  {
    key: 'serverOffline',
    title: 'Servidor offline',
    description: 'Avisar quando um servidor ficar indisponível.',
  },
  {
    key: 'playerJoined',
    title: 'Entrada de jogadores',
    description: 'Avisar quando um jogador entrar no servidor.',
  },
  {
    key: 'performanceAlerts',
    title: 'Alertas de desempenho',
    description: 'Avisar sobre TPS baixo ou uso alto de memória.',
  },
]

export function NotificationsSection({
  preferences,
}: {
  preferences: NotificationPreferences
}) {
  const { trigger, isMutating } = useUpdateNotificationPreferences()
  const [savingKey, setSavingKey] = useState<PreferenceKey | null>(null)

  async function handleToggle(key: PreferenceKey, checked: boolean) {
    if (isMutating) return
    setSavingKey(key)
    try {
      await trigger({ [key]: checked })
      toast.success('Preferência salva.')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar a preferência.',
      )
    } finally {
      setSavingKey(null)
    }
  }

  return (
    <SettingsSection title="Notificações">
      {PREFERENCE_OPTIONS.map((option, index) => {
        const id = `pref-${option.key}`
        const isSaving = savingKey === option.key
        return (
          <div key={option.key}>
            {index > 0 && <ItemSeparator />}
            <Item>
              <ItemContent className="min-w-0">
                <ItemTitle>
                  <label htmlFor={id} className="cursor-pointer">
                    {option.title}
                  </label>
                </ItemTitle>
                <ItemDescription>{option.description}</ItemDescription>
              </ItemContent>
              <ItemActions className="gap-2">
                {isSaving && <Spinner className="size-4 text-muted-foreground" />}
                <Switch
                  id={id}
                  checked={preferences[option.key]}
                  disabled={isMutating}
                  onCheckedChange={(checked) =>
                    handleToggle(option.key, checked)
                  }
                />
              </ItemActions>
            </Item>
          </div>
        )
      })}
    </SettingsSection>
  )
}
