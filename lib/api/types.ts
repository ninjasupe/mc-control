import type {
  Account,
  LogEntry,
  NewServerInput,
  NotificationPreferences,
  Player,
  Server,
} from '@/lib/types'

/**
 * Contrato único da camada de dados do MC Control.
 *
 * A UI depende apenas desta interface. Hoje ela é implementada por um mock
 * em memória (`lib/api/mock`); no futuro uma implementação `remote` pode
 * falar com a API real (REST, WebSocket ou RCON) sem alterar as telas.
 */
export interface McControlApi {
  servers: {
    list(): Promise<Server[]>
    get(id: string): Promise<Server | null>
    create(input: NewServerInput): Promise<Server>
    rename(id: string, name: string): Promise<Server>
    /**
     * Ações de energia. A promise resolve com o servidor no estado final
     * (`online`/`offline`) e rejeita se a transição não for permitida.
     * Estados intermediários (`starting`/`stopping`) são observáveis via
     * `list()`/`get()` enquanto a ação está em andamento.
     */
    start(id: string): Promise<Server>
    stop(id: string): Promise<Server>
    restart(id: string): Promise<Server>
  }
  players: {
    list(serverId: string): Promise<Player[]>
  }
  console: {
    getLogs(serverId: string, limit?: number): Promise<LogEntry[]>
    sendCommand(serverId: string, command: string): Promise<LogEntry[]>
  }
  account: {
    get(): Promise<Account>
    getNotificationPreferences(): Promise<NotificationPreferences>
    updateNotificationPreferences(
      prefs: Partial<NotificationPreferences>,
    ): Promise<NotificationPreferences>
  }
}
