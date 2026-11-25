'use client'

import * as React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useRenameServer } from '@/hooks/use-servers'
import type { Server } from '@/lib/types'

interface RenameServerDrawerProps {
  server: Server | null
  onOpenChange: (open: boolean) => void
}

export function RenameServerDrawer({
  server,
  onOpenChange,
}: RenameServerDrawerProps) {
  const { trigger, isMutating } = useRenameServer(server?.id ?? null)
  const [error, setError] = React.useState<string | null>(null)
  const formId = React.useId()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!server) return

    const name = String(new FormData(event.currentTarget).get('name') ?? '').trim()
    if (name.length < 2) {
      setError('Informe um nome com pelo menos 2 caracteres.')
      return
    }
    setError(null)

    try {
      await trigger(name)
      toast.success('Servidor renomeado')
      onOpenChange(false)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Não foi possível renomear o servidor',
      )
    }
  }

  return (
    <Drawer
      open={server !== null}
      onOpenChange={(next) => {
        if (!next) setError(null)
        onOpenChange(next)
      }}
      showSwipeHandle
    >
      <DrawerContent className="mx-auto w-full max-w-md">
        <DrawerHeader>
          <DrawerTitle>Renomear servidor</DrawerTitle>
          <DrawerDescription>
            O novo nome aparece em todas as telas do MC Control.
          </DrawerDescription>
        </DrawerHeader>

        {server && (
          <form
            id={formId}
            key={server.id}
            onSubmit={handleSubmit}
            className="px-4 pb-2"
            noValidate
          >
            <Field data-invalid={Boolean(error) || undefined}>
              <FieldLabel htmlFor={`${formId}-name`}>Nome</FieldLabel>
              <Input
                id={`${formId}-name`}
                name="name"
                defaultValue={server.name}
                autoComplete="off"
                aria-invalid={Boolean(error) || undefined}
                required
              />
              <FieldError>{error}</FieldError>
            </Field>
          </form>
        )}

        <DrawerFooter className="pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Button type="submit" form={formId} size="lg" disabled={isMutating}>
            {isMutating && <Spinner data-icon="inline-start" />}
            {isMutating ? 'Salvando...' : 'Salvar'}
          </Button>
          <DrawerClose render={<Button variant="ghost" size="lg" />} nativeButton>
            Cancelar
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
