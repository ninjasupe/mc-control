import { Suspense } from 'react'

import { ServersScreen } from '@/components/servers/servers-screen'

export default function ServersPage() {
  return (
    <Suspense fallback={null}>
      <ServersScreen />
    </Suspense>
  )
}
