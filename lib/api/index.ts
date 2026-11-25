import { APP_CONFIG } from '@/lib/config'

import { mockApi } from './mock'
import type { McControlApi } from './types'

function resolveApi(): McControlApi {
  switch (APP_CONFIG.dataSource) {
    case 'remote':
      // Ponto de troca para a API real (REST/WebSocket/RCON).
      // Enquanto não existir, caímos no mock para o app continuar utilizável.
      return mockApi
    case 'mock':
    default:
      return mockApi
  }
}

export const api: McControlApi = resolveApi()

export type { McControlApi } from './types'
