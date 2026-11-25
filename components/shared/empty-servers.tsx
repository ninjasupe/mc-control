import Link from 'next/link'
import { PlusIcon, ServerOffIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export function EmptyServers() {
  return (
    <Empty className="rounded-xl border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ServerOffIcon />
        </EmptyMedia>
        <EmptyTitle>Nenhum servidor adicionado</EmptyTitle>
        <EmptyDescription>
          Adicione um servidor para acompanhar status, jogadores e console.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button render={<Link href="/servers?novo=1" />} nativeButton={false}>
          <PlusIcon data-icon="inline-start" />
          Adicionar servidor
        </Button>
      </EmptyContent>
    </Empty>
  )
}
