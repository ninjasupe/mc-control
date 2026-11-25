import type {
  Account,
  LogEntry,
  LogLevel,
  NotificationPreferences,
  Player,
  Server,
} from '@/lib/types'

const HOUR = 60 * 60
const DAY = 24 * HOUR

export const seedServers: Server[] = [
  {
    id: 'srv-survival',
    name: 'Servidor Survival',
    address: 'survival.mccontrol.app',
    port: 25565,
    version: '1.21.11',
    status: 'online',
    playersOnline: 4,
    maxPlayers: 20,
    metrics: {
      cpuPercent: 23,
      ramUsedGb: 1.4,
      ramTotalGb: 4,
      tps: 19.9,
      uptimeSeconds: 3 * DAY + 4 * HOUR + 12 * 60,
    },
  },
  {
    id: 'srv-creative',
    name: 'Servidor Criativo',
    address: 'criativo.mccontrol.app',
    port: 25566,
    version: '1.21.4',
    status: 'offline',
    playersOnline: 0,
    maxPlayers: 10,
    metrics: {
      cpuPercent: 0,
      ramUsedGb: 0,
      ramTotalGb: 2,
      tps: 0,
      uptimeSeconds: 0,
    },
  },
  {
    id: 'srv-minigames',
    name: 'Minigames',
    address: 'mini.mccontrol.app',
    port: 25567,
    version: '1.20.6',
    status: 'online',
    playersOnline: 12,
    maxPlayers: 50,
    metrics: {
      cpuPercent: 41,
      ramUsedGb: 2.7,
      ramTotalGb: 6,
      tps: 19.6,
      uptimeSeconds: 11 * HOUR + 48 * 60,
    },
  },
]

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

export const seedPlayers: Record<string, Player[]> = {
  'srv-survival': [
    {
      id: 'p-luis',
      name: 'Luis',
      avatarUrl: '/avatars/luis.png',
      status: 'online',
      pingMs: 18,
      joinedAt: minutesAgo(142),
      isOperator: true,
    },
    {
      id: 'p-steve',
      name: 'Steve',
      avatarUrl: '/avatars/steve.png',
      status: 'online',
      pingMs: 34,
      joinedAt: minutesAgo(97),
      isOperator: false,
    },
    {
      id: 'p-alex',
      name: 'Alex',
      avatarUrl: '/avatars/alex.png',
      status: 'online',
      pingMs: 52,
      joinedAt: minutesAgo(61),
      isOperator: false,
    },
    {
      id: 'p-player4',
      name: 'Player4',
      avatarUrl: '/avatars/player4.png',
      status: 'online',
      pingMs: 121,
      joinedAt: minutesAgo(9),
      isOperator: false,
    },
  ],
  'srv-creative': [],
  'srv-minigames': [
    'Mateus',
    'Ana',
    'Rafa',
    'Duda',
    'Theo',
    'Nina',
    'Kaue',
    'Bia',
    'Gui',
    'Lara',
    'Davi',
    'Sofia',
  ].map((name, index) => ({
    id: `p-mini-${name.toLowerCase()}`,
    name,
    status: 'online' as const,
    pingMs: 20 + ((index * 37) % 90),
    joinedAt: minutesAgo(5 + index * 11),
    isOperator: index === 0,
  })),
}

function log(
  serverId: string,
  minutes: number,
  level: LogLevel,
  message: string,
  index: number,
): LogEntry {
  return {
    // Id com prefixo do servidor: evita chaves React repetidas entre servidores.
    id: `seed-${serverId}-${index}`,
    timestamp: minutesAgo(minutes),
    level,
    message,
  }
}

export const seedLogs: Record<string, LogEntry[]> = {
  'srv-survival': [
    [150, 'INFO', 'Servidor iniciado.'],
    [150, 'INFO', 'Mundo carregado.'],
    [149, 'INFO', 'Pronto! Concluído em 8,412s.'],
    [142, 'INFO', 'Luis entrou no jogo.'],
    [97, 'INFO', 'Steve entrou no jogo.'],
    [61, 'INFO', 'Alex entrou no jogo.'],
    [40, 'INFO', 'Salvamento automático concluído.'],
    [22, 'WARN', 'Servidor não conseguiu acompanhar! Atrasado 2043ms.'],
    [9, 'INFO', 'Player4 entrou no jogo.'],
    [8, 'INFO', 'Jogadores online: 4.'],
    [3, 'INFO', 'Backup automático concluído (world, 812 MB).'],
  ].map(([minutes, level, message], index) =>
    log('srv-survival', minutes as number, level as LogLevel, message as string, index),
  ),
  'srv-creative': [
    [480, 'INFO', 'Salvando mundo...'],
    [480, 'INFO', 'Mundo salvo com sucesso.'],
    [479, 'INFO', 'Servidor parado.'],
  ].map(([minutes, level, message], index) =>
    log('srv-creative', minutes as number, level as LogLevel, message as string, index),
  ),
  'srv-minigames': [
    [708, 'INFO', 'Servidor iniciado.'],
    [708, 'INFO', 'Mundo carregado.'],
    [700, 'INFO', 'Arena BedWars #1 pronta.'],
    [44, 'INFO', 'Partida SkyWars finalizada. Vencedor: Nina.'],
    [12, 'WARN', 'Uso de CPU acima de 40% nos últimos 5 minutos.'],
    [2, 'INFO', 'Jogadores online: 12.'],
  ].map(([minutes, level, message], index) =>
    log('srv-minigames', minutes as number, level as LogLevel, message as string, index),
  ),
}

export const ambientMessages = [
  'Salvamento automático concluído.',
  'Luis conquistou o avanço [Pedra Fria].',
  '<Steve> alguém tem diamante sobrando?',
  '<Alex> to na base, vem',
  'Verificação de integridade do mundo: OK.',
  'Backup incremental agendado para 03:00.',
]

export const seedAccount: Account = {
  id: 'acc-1',
  name: 'Luis',
  email: 'luis@exemplo.com',
  plan: 'Gratuito',
}

export const seedNotificationPreferences: NotificationPreferences = {
  serverOffline: true,
  playerJoined: false,
  performanceAlerts: true,
}
