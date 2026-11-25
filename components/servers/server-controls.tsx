'use client'

import * as React from 'react'
import { PlayIcon, RotateCcwIcon, SquareIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Spinner } from '@/components/ui/spinner'
import { type ServerAction, useServerActions } from '@/hooks/use-server-actions'
import type { Server, ServerStatus } from '@/lib/types'

const statusHint: Record<ServerStatus, string> = {
  online: 'Servidor em execução e aceitando jogadores.',
  offline: 'Servidor desligado. Inicie para aceitar jogadores.',
  starting: 'Inicializando o servidor, aguarde...',
  stopping: 'Desligando o servidor, aguarde...',
}

const pendingLabel: Record<ServerAction, string> = {
  start: 'Iniciando...',
  stop: 'Parando...',
  restart: 'Reiniciando...',
}

const successMessage: Record<ServerAction, string> = {
  start: 'Servidor iniciado',
  stop: 'Servidor parado',
  restart: 'Servidor reiniciado',
}

const failureMessage: Record<ServerAction, string> = {
  start: 'Não foi possível iniciar o servidor',
  stop: 'Não foi possível parar o servidor',
  restart: 'Não foi possível reiniciar o servidor',
}

type ConfirmableAction = Extract<ServerAction, 'stop' | 'restart'>

export function ServerControls({ server }: { server: Server }) {
  const { run, pendingAction, isPending } = useServerActions(server.id)
  const [confirming, setConfirming] = React.useState<ConfirmableAction | null>(
    null,
  )

  const isTransitioning =
    server.status === 'starting' || server.status === 'stopping'
  const locked = isPending || isTransitioning

  const canStart = server.status === 'offline' && !locked
  const canStop = server.status === 'online' && !locked
  const canRestart = server.status === 'online' && !locked

  async function execute(action: ServerAction) {
    setConfirming(null)
    try {
      await run(action)
      toast.success(successMessage[action])
    } catch (error) {
      toast.error(failureMessage[action], {
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  function label(action: ServerAction, idle: string) {
    return pendingAction === action ? pendingLabel[action] : idle
  }

  function icon(action: ServerAction, Icon: typeof PlayIcon) {
    return pendingAction === action ? (
      <Spinner data-icon="inline-start" />
    ) : (
      <Icon data-icon="inline-start" />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Controles</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p
          className="text-sm text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          {statusHint[server.status]}
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Button
            size="lg"
            disabled={!canStart}
            aria-busy={pendingAction === 'start' || undefined}
            onClick={() => void execute('start')}
          >
            {icon('start', PlayIcon)}
            {label('start', 'Iniciar')}
          </Button>
          <Button
            size="lg"
            variant="destructive"
            disabled={!canStop}
            aria-busy={pendingAction === 'stop' || undefined}
            onClick={() => setConfirming('stop')}
          >
            {icon('stop', SquareIcon)}
            {label('stop', 'Parar')}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="col-span-2"
            disabled={!canRestart}
            aria-busy={pendingAction === 'restart' || undefined}
            onClick={() => setConfirming('restart')}
          >
            {icon('restart', RotateCcwIcon)}
            {label('restart', 'Reiniciar')}
          </Button>
        </div>
      </CardContent>

      <ConfirmServerActionDrawer
        action={confirming}
        serverName={server.name}
        onCancel={() => setConfirming(null)}
        onConfirm={(action) => void execute(action)}
      />
    </Card>
  )
}

const confirmCopy: Record<
  ConfirmableAction,
  { title: string; description: (name: string) => string; cta: string }
> = {
  stop: {
    title: 'Parar servidor?',
    description: (name) =>
      `Os jogadores conectados em ${name} serão desconectados até que ele seja iniciado novamente.`,
    cta: 'Parar servidor',
  },
  restart: {
    title: 'Reiniciar servidor?',
    description: (name) =>
      `${name} ficará indisponível por alguns instantes e os jogadores serão desconectados.`,
    cta: 'Reiniciar servidor',
  },
}

function ConfirmServerActionDrawer({
  action,
  serverName,
  onCancel,
  onConfirm,
}: {
  action: ConfirmableAction | null
  serverName: string
  onCancel: () => void
  onConfirm: (action: ConfirmableAction) => void
}) {
  const copy = action ? confirmCopy[action] : null

  return (
    <Drawer
      open={action !== null}
      onOpenChange={(open) => {
        if (!open) onCancel()
      }}
      showSwipeHandle
    >
      <DrawerContent className="mx-auto w-full max-w-md">
        {copy && action && (
          <>
            <DrawerHeader>
              <DrawerTitle>{copy.title}</DrawerTitle>
              <DrawerDescription>{copy.description(serverName)}</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <Button
                size="lg"
                variant={action === 'stop' ? 'destructive' : 'default'}
                onClick={() => onConfirm(action)}
              >
                {copy.cta}
              </Button>
              <DrawerClose render={<Button variant="ghost" size="lg" />} nativeButton>
                Cancelar
              </DrawerClose>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
