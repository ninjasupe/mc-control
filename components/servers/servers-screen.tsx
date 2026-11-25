'use client'

import * as React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { PlusIcon } from 'lucide-react'

import { PageHeader } from '@/components/app-shell/page-header'
import { useSelectedServer } from '@/components/providers/server-provider'
import { EmptyServers } from '@/components/shared/empty-servers'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Server } from '@/lib/types'

import { AddServerDrawer } from './add-server-drawer'
import { RenameServerDrawer } from './rename-server-drawer'
import { ServerCard } from './server-card'

const NEW_SERVER_PARAM = 'novo'

export function ServersScreen() {
  const { servers, selectedServerId, isLoading } = useSelectedServer()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [renaming, setRenaming] = React.useState<Server | null>(null)

  const addOpen = searchParams.get(NEW_SERVER_PARAM) === '1'

  function setAddOpen(open: boolean) {
    const params = new URLSearchParams(searchParams.toString())
    if (open) params.set(NEW_SERVER_PARAM, '1')
    else params.delete(NEW_SERVER_PARAM)
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  if (isLoading && servers.length === 0) {
    return <ServersSkeleton />
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Servidores"
        description={
          servers.length > 0
            ? `${servers.length} ${servers.length === 1 ? 'servidor cadastrado' : 'servidores cadastrados'}.`
            : 'Cadastre e gerencie seus servidores Minecraft.'
        }
        action={
          servers.length > 0 ? (
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <PlusIcon data-icon="inline-start" />
              Adicionar
            </Button>
          ) : undefined
        }
      />

      {servers.length === 0 ? (
        <EmptyServers />
      ) : (
        <ul className="flex flex-col gap-3" aria-label="Lista de servidores">
          {servers.map((server) => (
            <li key={server.id}>
              <ServerCard
                server={server}
                isSelected={server.id === selectedServerId}
                onRename={() => setRenaming(server)}
              />
            </li>
          ))}
        </ul>
      )}

      <AddServerDrawer open={addOpen} onOpenChange={setAddOpen} />
      <RenameServerDrawer
        server={renaming}
        onOpenChange={(open) => {
          if (!open) setRenaming(null)
        }}
      />
    </div>
  )
}

function ServersSkeleton() {
  return (
    <div
      className="flex flex-col gap-4"
      aria-busy="true"
      aria-label="Carregando servidores"
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-40 rounded-xl" />
      <Skeleton className="h-40 rounded-xl" />
      <Skeleton className="h-40 rounded-xl" />
    </div>
  )
}
