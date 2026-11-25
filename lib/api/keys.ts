/** Chaves SWR centralizadas para facilitar invalidação de cache. */
export const apiKeys = {
  servers: ['servers'] as const,
  server: (id: string) => ['server', id] as const,
  players: (serverId: string) => ['players', serverId] as const,
  logs: (serverId: string) => ['logs', serverId] as const,
  account: ['account'] as const,
  notificationPreferences: ['notification-preferences'] as const,
}
