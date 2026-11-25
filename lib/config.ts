export const APP_CONFIG = {
  name: 'MC Control',
  description: 'Monitore e gerencie seus servidores Minecraft pelo celular.',
  version: '1.0.0',
  build: '2026.09.15',
  /**
   * Fonte de dados ativa. Quando a API real existir, basta trocar para
   * "remote" e implementar `lib/api/remote`.
   */
  dataSource: (process.env.NEXT_PUBLIC_MC_DATA_SOURCE ?? 'mock') as
    | 'mock'
    | 'remote',
} as const

export const SUPPORTED_VERSIONS = [
  '1.21.11',
  '1.21.4',
  '1.21.1',
  '1.20.6',
  '1.20.4',
  '1.19.4',
  '1.18.2',
  '1.16.5',
] as const
