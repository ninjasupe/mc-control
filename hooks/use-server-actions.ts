'use client'

import * as React from 'react'
import { useSWRConfig } from 'swr'

import { api } from '@/lib/api'
import { apiKeys } from '@/lib/api/keys'
import type { Server } from '@/lib/types'

export type ServerAction = 'start' | 'stop' | 'restart'

/** Enquanto uma ação está em andamento, revalida mais rápido que o polling padrão. */
const PENDING_REFRESH_MS = 1_000

export function useServerActions(serverId: string | null) {
  const { mutate } = useSWRConfig()
  const [pendingAction, setPendingAction] = React.useState<ServerAction | null>(
    null,
  )
  const lockRef = React.useRef(false)

  const refresh = React.useCallback(
    (id: string) =>
      Promise.all([mutate(apiKeys.servers), mutate(apiKeys.server(id))]),
    [mutate],
  )

  React.useEffect(() => {
    if (!pendingAction || !serverId) return
    const interval = setInterval(() => void refresh(serverId), PENDING_REFRESH_MS)
    return () => clearInterval(interval)
  }, [pendingAction, serverId, refresh])

  const run = React.useCallback(
    async (action: ServerAction): Promise<Server | undefined> => {
      if (!serverId || lockRef.current) return
      lockRef.current = true
      setPendingAction(action)

      try {
        const request = api.servers[action](serverId)
        // Captura o estado intermediário (starting/stopping) imediatamente.
        void refresh(serverId)
        const updated = await request

        await Promise.all([
          mutate(apiKeys.server(serverId), updated, { revalidate: false }),
          mutate(
            apiKeys.servers,
            (list?: Server[]) =>
              list?.map((s) => (s.id === updated.id ? updated : s)),
            { revalidate: false },
          ),
          mutate(apiKeys.players(serverId)),
          mutate(apiKeys.logs(serverId)),
        ])
        return updated
      } catch (error) {
        // Garante que a UI volte a refletir o estado real após a falha.
        void refresh(serverId)
        throw error
      } finally {
        lockRef.current = false
        setPendingAction(null)
      }
    },
    [serverId, mutate, refresh],
  )

  return { run, pendingAction, isPending: pendingAction !== null }
}
