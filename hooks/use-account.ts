'use client'

import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

import { api } from '@/lib/api'
import { apiKeys } from '@/lib/api/keys'
import type { NotificationPreferences } from '@/lib/types'

export function useAccount() {
  return useSWR(apiKeys.account, () => api.account.get())
}

export function useNotificationPreferences() {
  return useSWR(apiKeys.notificationPreferences, () =>
    api.account.getNotificationPreferences(),
  )
}

export function useUpdateNotificationPreferences() {
  return useSWRMutation(
    apiKeys.notificationPreferences,
    (_key, { arg }: { arg: Partial<NotificationPreferences> }) =>
      api.account.updateNotificationPreferences(arg),
    {
      populateCache: (updated: NotificationPreferences) => updated,
      revalidate: false,
    },
  )
}
