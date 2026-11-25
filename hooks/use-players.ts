'use client'

import useSWR from 'swr'

import { api } from '@/lib/api'
import { apiKeys } from '@/lib/api/keys'

const LIVE_REFRESH_MS = 6_000

export function usePlayers(serverId: string | null) {
  return useSWR(
    serverId ? apiKeys.players(serverId) : null,
    // O serverId vem da própria chave: a resposta pertence sempre ao servidor
    // da chave ativa e o SWR descarta respostas de chaves antigas.
    ([, id]) => api.players.list(id),
    { refreshInterval: LIVE_REFRESH_MS, keepPreviousData: false },
  )
}
