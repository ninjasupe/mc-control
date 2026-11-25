'use client'

import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

import { api } from '@/lib/api'
import { apiKeys } from '@/lib/api/keys'
import type { LogEntry } from '@/lib/types'

const LIVE_REFRESH_MS = 4_000

type LogsKey = ReturnType<typeof apiKeys.logs>

export function useLogs(serverId: string | null, limit = 100) {
  return useSWR(
    serverId ? apiKeys.logs(serverId) : null,
    // O id vem da própria chave (e não do closure) para que a resposta
    // pertença sempre ao servidor da chave ativa.
    ([, id]: LogsKey) => api.console.getLogs(id, limit),
    {
      refreshInterval: LIVE_REFRESH_MS,
      // Sem keepPreviousData: ao trocar de servidor `data` volta a
      // `undefined` e a UI mostra o skeleton em vez dos logs antigos.
      keepPreviousData: false,
      revalidateOnFocus: false,
    },
  )
}

export function useSendCommand(serverId: string | null) {
  return useSWRMutation(
    serverId ? apiKeys.logs(serverId) : null,
    ([, id]: LogsKey, { arg }: { arg: string }) =>
      api.console.sendCommand(id, arg),
    {
      populateCache: (entries: LogEntry[], current?: LogEntry[]) => [
        ...(current ?? []),
        ...entries,
      ],
      revalidate: false,
    },
  )
}
