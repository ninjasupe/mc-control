'use client'

import useSWR, { useSWRConfig } from 'swr'
import useSWRMutation from 'swr/mutation'

import { api } from '@/lib/api'
import { apiKeys } from '@/lib/api/keys'
import type { NewServerInput, Server } from '@/lib/types'

const LIVE_REFRESH_MS = 5_000

export function useServers() {
  return useSWR(apiKeys.servers, () => api.servers.list(), {
    refreshInterval: LIVE_REFRESH_MS,
    keepPreviousData: true,
  })
}

export function useServer(serverId: string | null) {
  return useSWR(
    serverId ? apiKeys.server(serverId) : null,
    () => api.servers.get(serverId as string),
    { refreshInterval: LIVE_REFRESH_MS, keepPreviousData: true },
  )
}

export function useAddServer() {
  const { mutate } = useSWRConfig()

  return useSWRMutation(
    apiKeys.servers,
    (_key, { arg }: { arg: NewServerInput }) => api.servers.create(arg),
    {
      populateCache: (created: Server, current?: Server[]) => [
        ...(current ?? []),
        created,
      ],
      revalidate: false,
      onSuccess: () => {
        void mutate(apiKeys.servers)
      },
    },
  )
}

export function useRenameServer(serverId: string | null) {
  const { mutate } = useSWRConfig()

  return useSWRMutation(
    serverId ? apiKeys.server(serverId) : null,
    (_key, { arg }: { arg: string }) =>
      api.servers.rename(serverId as string, arg),
    {
      populateCache: (updated: Server) => updated,
      revalidate: false,
      onSuccess: () => {
        void mutate(apiKeys.servers)
      },
    },
  )
}
