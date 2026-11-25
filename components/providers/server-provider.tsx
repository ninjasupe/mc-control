'use client'

import * as React from 'react'

import { useServers } from '@/hooks/use-servers'
import type { Server } from '@/lib/types'

interface ServerContextValue {
  servers: Server[]
  selectedServer: Server | null
  selectedServerId: string | null
  selectServer: (id: string) => void
  isLoading: boolean
}

const ServerContext = React.createContext<ServerContextValue | null>(null)

export function ServerProvider({ children }: { children: React.ReactNode }) {
  const { data: servers, isLoading } = useServers()
  const [selectedServerId, setSelectedServerId] = React.useState<string | null>(
    null,
  )

  const list = React.useMemo(() => servers ?? [], [servers])

  const resolvedId = React.useMemo(() => {
    if (selectedServerId && list.some((s) => s.id === selectedServerId)) {
      return selectedServerId
    }
    return list[0]?.id ?? null
  }, [list, selectedServerId])

  const selectedServer = React.useMemo(
    () => list.find((s) => s.id === resolvedId) ?? null,
    [list, resolvedId],
  )

  const value = React.useMemo<ServerContextValue>(
    () => ({
      servers: list,
      selectedServer,
      selectedServerId: resolvedId,
      selectServer: setSelectedServerId,
      isLoading,
    }),
    [list, selectedServer, resolvedId, isLoading],
  )

  return (
    <ServerContext.Provider value={value}>{children}</ServerContext.Provider>
  )
}

export function useSelectedServer() {
  const context = React.useContext(ServerContext)
  if (!context) {
    throw new Error('useSelectedServer deve ser usado dentro de ServerProvider.')
  }
  return context
}
