'use client'

import * as React from 'react'
import { SendHorizontalIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

interface CommandInputProps {
  onSend: (command: string) => void | Promise<void>
  isSending?: boolean
  serverName?: string
}

export function CommandInput({
  onSend,
  isSending = false,
  serverName,
}: CommandInputProps) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSending) return

    const form = event.currentTarget
    const command = String(new FormData(form).get('command') ?? '').trim()
    if (!command) return

    try {
      await onSend(command)
      form.reset()
    } catch {
      // O erro já é exibido (toast) por quem trata onSend; mantemos o
      // texto digitado para o usuário poder corrigir e reenviar.
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex shrink-0 items-center gap-2">
      <Input
        name="command"
        placeholder="Digite um comando..."
        aria-label={
          serverName ? `Comando para ${serverName}` : 'Comando do console'
        }
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        enterKeyHint="send"
        className="min-w-0 flex-1 font-mono text-sm"
      />
      <Button type="submit" disabled={isSending} className="shrink-0">
        {isSending ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <SendHorizontalIcon data-icon="inline-start" />
        )}
        {isSending ? 'Enviando...' : 'Enviar'}
      </Button>
    </form>
  )
}
