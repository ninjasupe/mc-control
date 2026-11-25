'use client'

import { toast } from 'sonner'

import { PageHeader } from '@/components/app-shell/page-header'
import { useSelectedServer } from '@/components/providers/server-provider'
import { EmptyServers } from '@/components/shared/empty-servers'
import { ServerStatusBadge } from '@/components/shared/server-status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useLogs, useSendCommand } from '@/hooks/use-console'
import { useServer } from '@/hooks/use-servers'

import { CommandInput } from './command-input'
import { LogViewer } from './log-viewer'

const CONSOLE_LINES = 200

export function ConsoleScreen() {
  const { selectedServerId, selectedServer, isLoading } = useSelectedServer()
  const { data: liveServer } = useServer(selectedServerId)
  const server = liveServer ?? selectedServer

  const {
    data: logs,
    isLoading: isLoadingLogs,
    error: logsError,
  } = useLogs(
    selectedServerId,
    CONSOLE_LINES,
  )
  const { trigger: sendCommand, isMutating } = useSendCommand(selectedServerId)

  if (isLoading && !server) {
    return <ConsoleSkeleton />
  }

  if (!server) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title="Console" />
        <EmptyServers />
      </div>
    )
  }

  async function handleSend(command: string) {
    try {
      await sendCommand(command)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Não foi possível enviar o comando.',
      )
      throw error
    }
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem-1rem-5.5rem-env(safe-area-inset-bottom))] min-h-[420px] flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <PageHeader title="Console" description={server.name} />
        <ServerStatusBadge status={server.status} className="mt-1 shrink-0" />
      </div>

      {/* `key` remonta viewer e input ao trocar de servidor: zera a rolagem
          fixada e o texto digitado, sem carregar nada do servidor anterior. */}
      <LogViewer
        key={`viewer-${server.id}`}
        logs={logs ?? []}
        isLoading={isLoadingLogs || (logs === undefined && !logsError)}
        className="min-h-0 flex-1"
      />

      <CommandInput
        key={`input-${server.id}`}
        onSend={handleSend}
        isSending={isMutating}
        serverName={server.name}
      />
    </div>
  )
}

function ConsoleSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-7 w-28" />
      <Skeleton className="h-[60dvh] w-full rounded-xl" />
      <Skeleton className="h-8 w-full rounded-lg" />
    </div>
  )
}
