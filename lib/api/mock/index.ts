import type { McControlApi } from '@/lib/api/types'
import type {
  LogEntry,
  LogLevel,
  NewServerInput,
  NotificationPreferences,
  Player,
  Server,
} from '@/lib/types'

import {
  ambientMessages,
  seedAccount,
  seedLogs,
  seedNotificationPreferences,
  seedPlayers,
  seedServers,
} from './seed'

/**
 * Implementação em memória do contrato `McControlApi`.
 *
 * O estado vive enquanto a aba estiver aberta (módulo singleton), o que é
 * suficiente para navegar entre telas e simular comandos. Um refresh da
 * página restaura os dados iniciais.
 */

const AMBIENT_LOG_INTERVAL_MS = 15_000
const MAX_LOGS = 200
const START_DURATION_MS = 2_500
const STOP_DURATION_MS = 1_800

const state = {
  servers: structuredClone(seedServers) as Server[],
  players: structuredClone(seedPlayers) as Record<string, Player[]>,
  logs: structuredClone(seedLogs) as Record<string, LogEntry[]>,
  notificationPreferences: { ...seedNotificationPreferences },
  lastAmbientLogAt: new Map<string, number>(),
  logCounter: 0,
}

function delay(min = 120, max = 320) {
  const ms = min + Math.random() * (max - min)
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function jitter(value: number, amount: number) {
  return value + (Math.random() * 2 - 1) * amount
}

function createLog(level: LogLevel, message: string): LogEntry {
  state.logCounter += 1
  return {
    id: `log-${Date.now()}-${state.logCounter}`,
    timestamp: new Date().toISOString(),
    level,
    message,
  }
}

function appendLogs(serverId: string, entries: LogEntry[]) {
  const current = state.logs[serverId] ?? []
  state.logs[serverId] = [...current, ...entries].slice(-MAX_LOGS)
}

function findServer(serverId: string) {
  return state.servers.find((server) => server.id === serverId) ?? null
}

function requireServer(serverId: string) {
  const server = findServer(serverId)
  if (!server) throw new Error('Servidor não encontrado.')
  return server
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Transições de energia. O status intermediário é gravado de forma síncrona
 * (antes de qualquer `await`) para que um `list()`/`get()` disparado logo
 * após a chamada já observe `starting`/`stopping`.
 */
async function runStop(server: Server) {
  server.status = 'stopping'
  appendLogs(server.id, [createLog('INFO', 'Stopping the server')])
  await wait(STOP_DURATION_MS)

  const players = state.players[server.id] ?? []
  players.forEach((player) => {
    player.status = 'offline'
  })
  server.playersOnline = 0
  server.metrics = { ...server.metrics, cpuPercent: 0, ramUsedGb: 0, tps: 0, uptimeSeconds: 0 }
  server.status = 'offline'
  appendLogs(server.id, [createLog('INFO', 'Saving worlds... Server stopped.')])
}

async function runStart(server: Server) {
  server.status = 'starting'
  appendLogs(server.id, [
    createLog('INFO', `Starting minecraft server version ${server.version}`),
  ])
  await wait(START_DURATION_MS)

  server.metrics = { ...server.metrics, uptimeSeconds: 0 }
  server.status = 'online'
  state.lastAmbientLogAt.set(server.id, Date.now())
  appendLogs(server.id, [createLog('INFO', 'Done! For help, type "help"')])
}

/** Simula variação leve de métricas para dar sensação de tempo real. */
function tickMetrics(server: Server): Server {
  if (server.status !== 'online') return server

  const base = seedServers.find((seed) => seed.id === server.id)?.metrics
  const cpuBase = base?.cpuPercent ?? server.metrics.cpuPercent
  const ramBase = base?.ramUsedGb ?? server.metrics.ramUsedGb

  server.metrics = {
    ...server.metrics,
    cpuPercent: Math.round(clamp(jitter(cpuBase, 3), 1, 99)),
    ramUsedGb: Number(
      clamp(jitter(ramBase, 0.08), 0.1, server.metrics.ramTotalGb).toFixed(2),
    ),
    tps: Number(clamp(jitter(19.9, 0.15), 15, 20).toFixed(1)),
    uptimeSeconds: server.metrics.uptimeSeconds + 5,
  }
  return server
}

/** Adiciona uma linha ocasional ao console de servidores online. */
function maybeAppendAmbientLog(serverId: string) {
  const server = findServer(serverId)
  if (!server || server.status !== 'online') return

  const last = state.lastAmbientLogAt.get(serverId) ?? Date.now()
  if (!state.lastAmbientLogAt.has(serverId)) {
    state.lastAmbientLogAt.set(serverId, last)
    return
  }
  if (Date.now() - last < AMBIENT_LOG_INTERVAL_MS) return

  const message =
    ambientMessages[Math.floor(Math.random() * ambientMessages.length)]
  appendLogs(serverId, [createLog('INFO', message)])
  state.lastAmbientLogAt.set(serverId, Date.now())
}

function handleCommand(server: Server, raw: string): LogEntry[] {
  const command = raw.trim()
  const [name, ...args] = command.split(/\s+/)
  const players = state.players[server.id] ?? []
  const echo = createLog('CMD', command)

  if (server.status !== 'online') {
    return [
      echo,
      createLog('ERROR', 'O servidor está offline. Inicie-o para enviar comandos.'),
    ]
  }

  switch (name.toLowerCase()) {
    case 'help':
      return [
        echo,
        createLog(
          'INFO',
          'Comandos disponíveis: help, list, say <msg>, time set <day|night>, weather <clear|rain>, tps, kick <jogador>, stop',
        ),
      ]
    case 'list':
      return [
        echo,
        createLog(
          'INFO',
          `Há ${players.length} de no máximo ${server.maxPlayers} jogadores online: ${players.map((p) => p.name).join(', ') || '—'}`,
        ),
      ]
    case 'say':
      if (args.length === 0) {
        return [echo, createLog('ERROR', 'Uso: say <mensagem>')]
      }
      return [echo, createLog('INFO', `[Server] ${args.join(' ')}`)]
    case 'time': {
      const value = args[1]?.toLowerCase()
      if (args[0]?.toLowerCase() !== 'set' || !value) {
        return [echo, createLog('ERROR', 'Uso: time set <day|night>')]
      }
      const ticks = value === 'night' ? 13000 : 1000
      return [echo, createLog('INFO', `Horário definido para ${ticks}.`)]
    }
    case 'weather': {
      const value = args[0]?.toLowerCase()
      if (!value || !['clear', 'rain', 'thunder'].includes(value)) {
        return [echo, createLog('ERROR', 'Uso: weather <clear|rain|thunder>')]
      }
      const labels: Record<string, string> = {
        clear: 'limpo',
        rain: 'chuva',
        thunder: 'tempestade',
      }
      return [echo, createLog('INFO', `Clima definido para ${labels[value]}.`)]
    }
    case 'tps':
      return [
        echo,
        createLog(
          'INFO',
          `TPS dos últimos 1m, 5m, 15m: ${server.metrics.tps.toFixed(1)}, 19.9, 19.8`,
        ),
      ]
    case 'kick': {
      const target = players.find(
        (p) => p.name.toLowerCase() === args[0]?.toLowerCase(),
      )
      if (!target) {
        return [echo, createLog('ERROR', 'Jogador não encontrado.')]
      }
      return [
        echo,
        createLog(
          'WARN',
          `[Simulação] ${target.name} seria expulso. Ações administrativas reais chegam com a API.`,
        ),
      ]
    }
    case 'stop':
      return [
        echo,
        createLog(
          'WARN',
          '[Simulação] Parada do servidor indisponível no modo offline da V1.',
        ),
      ]
    default:
      return [
        echo,
        createLog(
          'ERROR',
          `Comando desconhecido: "${name}". Digite "help" para ver os comandos.`,
        ),
      ]
  }
}

export const mockApi: McControlApi = {
  servers: {
    async list() {
      await delay()
      state.servers.forEach(tickMetrics)
      return structuredClone(state.servers)
    },
    async get(id) {
      await delay(80, 200)
      const server = findServer(id)
      if (!server) return null
      tickMetrics(server)
      return structuredClone(server)
    },
    async create(input: NewServerInput) {
      await delay(300, 600)
      const server: Server = {
        id: `srv-${Date.now()}`,
        name: input.name.trim(),
        address: input.address.trim(),
        port: input.port,
        version: input.version,
        status: 'offline',
        playersOnline: 0,
        maxPlayers: 20,
        metrics: {
          cpuPercent: 0,
          ramUsedGb: 0,
          ramTotalGb: 4,
          tps: 0,
          uptimeSeconds: 0,
        },
      }
      state.servers.push(server)
      state.players[server.id] = []
      state.logs[server.id] = [
        createLog('INFO', `Servidor "${server.name}" adicionado ao MC Control.`),
        createLog(
          'INFO',
          'Aguardando primeira conexão com o agente do servidor...',
        ),
      ]
      return structuredClone(server)
    },
    async rename(id, name) {
      await delay(150, 300)
      const server = findServer(id)
      if (!server) throw new Error('Servidor não encontrado.')
      server.name = name.trim()
      return structuredClone(server)
    },
    async start(id) {
      const server = requireServer(id)
      if (server.status !== 'offline') {
        throw new Error(
          server.status === 'online'
            ? 'O servidor já está online.'
            : 'Já existe uma ação em andamento neste servidor.',
        )
      }
      await runStart(server)
      return structuredClone(server)
    },
    async stop(id) {
      const server = requireServer(id)
      if (server.status !== 'online') {
        throw new Error(
          server.status === 'offline'
            ? 'O servidor já está offline.'
            : 'Já existe uma ação em andamento neste servidor.',
        )
      }
      await runStop(server)
      return structuredClone(server)
    },
    async restart(id) {
      const server = requireServer(id)
      if (server.status !== 'online') {
        throw new Error(
          server.status === 'offline'
            ? 'O servidor está offline. Use "Iniciar".'
            : 'Já existe uma ação em andamento neste servidor.',
        )
      }
      await runStop(server)
      await runStart(server)
      return structuredClone(server)
    },
  },
  players: {
    async list(serverId) {
      await delay()
      const players = state.players[serverId] ?? []
      players.forEach((player) => {
        player.pingMs = Math.round(clamp(jitter(player.pingMs, 4), 8, 400))
      })
      return structuredClone(players)
    },
  },
  console: {
    async getLogs(serverId, limit = 100) {
      await delay(80, 180)
      maybeAppendAmbientLog(serverId)
      const logs = state.logs[serverId] ?? []
      return structuredClone(logs.slice(-limit))
    },
    async sendCommand(serverId, command) {
      await delay(150, 350)
      const server = findServer(serverId)
      if (!server) throw new Error('Servidor não encontrado.')
      const entries = handleCommand(server, command)
      appendLogs(serverId, entries)
      return structuredClone(entries)
    },
  },
  account: {
    async get() {
      await delay(80, 160)
      return { ...seedAccount }
    },
    async getNotificationPreferences() {
      await delay(60, 140)
      return { ...state.notificationPreferences }
    },
    async updateNotificationPreferences(
      prefs: Partial<NotificationPreferences>,
    ) {
      await delay(100, 200)
      state.notificationPreferences = {
        ...state.notificationPreferences,
        ...prefs,
      }
      return { ...state.notificationPreferences }
    },
  },
}
