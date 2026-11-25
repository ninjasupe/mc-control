'use client'

import * as React from 'react'
import { toast } from 'sonner'

import { useSelectedServer } from '@/components/providers/server-provider'
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useAddServer } from '@/hooks/use-servers'
import type { NewServerInput } from '@/lib/types'

interface AddServerDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DEFAULT_PORT = 25565
const DEFAULT_VERSION = '1.21.11'

type FormErrors = Partial<Record<keyof NewServerInput, string>>

function validate(input: NewServerInput): FormErrors {
  const errors: FormErrors = {}
  if (input.name.trim().length < 2) {
    errors.name = 'Informe um nome com pelo menos 2 caracteres.'
  }
  if (!input.address.trim()) {
    errors.address = 'Informe o IP ou endereço do servidor.'
  }
  if (!Number.isInteger(input.port) || input.port < 1 || input.port > 65535) {
    errors.port = 'A porta deve estar entre 1 e 65535.'
  }
  if (!input.version.trim()) {
    errors.version = 'Informe a versão do Minecraft.'
  }
  return errors
}

export function AddServerDrawer({ open, onOpenChange }: AddServerDrawerProps) {
  const { trigger, isMutating } = useAddServer()
  const { selectServer } = useSelectedServer()
  const [errors, setErrors] = React.useState<FormErrors>({})
  const formId = React.useId()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const input: NewServerInput = {
      name: String(form.get('name') ?? ''),
      address: String(form.get('address') ?? ''),
      port: Number(form.get('port') ?? DEFAULT_PORT),
      version: String(form.get('version') ?? '').trim(),
    }

    const nextErrors = validate(input)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    try {
      const created = await trigger(input)
      if (created) selectServer(created.id)
      toast.success(`Servidor "${input.name.trim()}" adicionado`)
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Não foi possível adicionar o servidor',
      )
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        if (!next) setErrors({})
        onOpenChange(next)
      }}
      showSwipeHandle
    >
      <DrawerContent className="mx-auto w-full max-w-md">
        <DrawerHeader>
          <DrawerTitle>Adicionar servidor</DrawerTitle>
          <DrawerDescription>
            Cadastre um servidor Minecraft para acompanhar pelo MC Control.
          </DrawerDescription>
        </DrawerHeader>

        <form
          id={formId}
          onSubmit={handleSubmit}
          className="overflow-y-auto px-4 pb-2"
          noValidate
        >
          <FieldGroup>
            <Field data-invalid={Boolean(errors.name) || undefined}>
              <FieldLabel htmlFor={`${formId}-name`}>Nome</FieldLabel>
              <Input
                id={`${formId}-name`}
                name="name"
                placeholder="Ex.: Survival da Galera"
                autoComplete="off"
                aria-invalid={Boolean(errors.name) || undefined}
                required
              />
              <FieldError>{errors.name}</FieldError>
            </Field>

            <div className="grid grid-cols-[1fr_7rem] gap-3">
              <Field data-invalid={Boolean(errors.address) || undefined}>
                <FieldLabel htmlFor={`${formId}-address`}>IP / Endereço</FieldLabel>
                <Input
                  id={`${formId}-address`}
                  name="address"
                  placeholder="play.exemplo.com"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-invalid={Boolean(errors.address) || undefined}
                  required
                />
                <FieldError>{errors.address}</FieldError>
              </Field>
              <Field data-invalid={Boolean(errors.port) || undefined}>
                <FieldLabel htmlFor={`${formId}-port`}>Porta</FieldLabel>
                <Input
                  id={`${formId}-port`}
                  name="port"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={65535}
                  defaultValue={DEFAULT_PORT}
                  aria-invalid={Boolean(errors.port) || undefined}
                  required
                />
                <FieldError>{errors.port}</FieldError>
              </Field>
            </div>

            <Field data-invalid={Boolean(errors.version) || undefined}>
              <FieldLabel htmlFor={`${formId}-version`}>Versão do Minecraft</FieldLabel>
              <Input
                id={`${formId}-version`}
                name="version"
                placeholder={DEFAULT_VERSION}
                defaultValue={DEFAULT_VERSION}
                autoComplete="off"
                aria-invalid={Boolean(errors.version) || undefined}
                required
              />
              <FieldDescription>
                O servidor é cadastrado como offline até a primeira conexão com o agente.
              </FieldDescription>
              <FieldError>{errors.version}</FieldError>
            </Field>
          </FieldGroup>
        </form>

        <DrawerFooter className="pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Button type="submit" form={formId} size="lg" disabled={isMutating}>
            {isMutating && <Spinner data-icon="inline-start" />}
            {isMutating ? 'Adicionando...' : 'Adicionar servidor'}
          </Button>
          <DrawerClose
            render={<Button variant="ghost" size="lg" />}
            nativeButton
          >
            Cancelar
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
