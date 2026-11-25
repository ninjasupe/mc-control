'use client'

import * as React from 'react'
import Link from 'next/link'
import { CheckIcon, ChevronsUpDownIcon, PlusIcon, UsersIcon } from 'lucide-react'

import { useSelectedServer } from '@/components/providers/server-provider'
import { StatusDot } from '@/components/shared/status-dot'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Skeleton } from '@/components/ui/skeleton'
import { serverStatusLabel } from '@/lib/format'
import { cn } from '@/lib/utils'

export function ServerSelector() {
  const { servers, selectedServer, selectServer, isLoading } =
    useSelectedServer()
  const [open, setOpen] = React.useState(false)

  if (isLoading && !selectedServer) {
    return <Skeleton className="h-8 w-36 rounded-full" />
  }

  if (!selectedServer) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="rounded-full"
        render={<Link href="/servers?novo=1" />}
        nativeButton={false}
      >
        <PlusIcon data-icon="inline-start" />
        Adicionar servidor
      </Button>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
      <DrawerTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="max-w-44 rounded-full pl-2.5"
            aria-label={`Servidor selecionado: ${selectedServer.name}. Trocar servidor`}
          />
        }
      >
        <StatusDot status={selectedServer.status} />
        <span className="truncate">{selectedServer.name}</span>
        <ChevronsUpDownIcon data-icon="inline-end" className="text-muted-foreground" />
      </DrawerTrigger>

      <DrawerContent className="mx-auto w-full max-w-md">
        <DrawerHeader>
          <DrawerTitle>Selecionar servidor</DrawerTitle>
          <DrawerDescription>
            O servidor escolhido é usado em todas as telas.
          </DrawerDescription>
        </DrawerHeader>

        <ul className="flex flex-col gap-1 overflow-y-auto p-4 pt-3" role="listbox" aria-label="Servidores">
          {servers.map((server) => {
            const isSelected = server.id === selectedServer.id
            return (
              <li key={server.id} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    selectServer(server.id)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors active:scale-[0.99]',
                    isSelected
                      ? 'border-primary/30 bg-primary/8'
                      : 'border-transparent hover:bg-muted/60',
                  )}
                >
                  <StatusDot status={server.status} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-foreground">
                      {server.name}
                    </span>
                    <span className="truncate font-mono text-xs text-muted-foreground">
                      {server.address}:{server.port}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground">
                    <UsersIcon className="size-3.5" aria-hidden="true" />
                    <span className="sr-only">Jogadores: </span>
                    {server.playersOnline}/{server.maxPlayers}
                  </span>
                  <span className="sr-only">
                    , {serverStatusLabel[server.status]}
                  </span>
                  {isSelected && (
                    <CheckIcon
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </li>
            )
          })}
        </ul>

        <DrawerFooter className="pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Button
            variant="secondary"
            size="lg"
            render={<Link href="/servers?novo=1" />}
            nativeButton={false}
            onClick={() => setOpen(false)}
          >
            <PlusIcon data-icon="inline-start" />
            Adicionar servidor
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
