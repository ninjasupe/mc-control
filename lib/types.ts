export type ServerStatus = 'online' | 'offline' | 'starting' | 'stopping'

export interface ServerMetrics {
  cpuPercent: number
  ramUsedGb: number
  ramTotalGb: number
  tps: number
  uptimeSeconds: number
}

export interface Server {
  id: string
  name: string
  address: string
  port: number
  version: string
  status: ServerStatus
  playersOnline: number
  maxPlayers: number
  metrics: ServerMetrics
}

export type PlayerStatus = 'online' | 'offline'

export interface Player {
  id: string
  name: string
  avatarUrl?: string
  status: PlayerStatus
  pingMs: number
  joinedAt: string
  isOperator: boolean
}

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'CMD'

export interface LogEntry {
  id: string
  timestamp: string
  level: LogLevel
  message: string
}

export interface NewServerInput {
  name: string
  address: string
  port: number
  version: string
}

export interface Account {
  id: string
  name: string
  email: string
  plan: string
}

export interface NotificationPreferences {
  serverOffline: boolean
  playerJoined: boolean
  performanceAlerts: boolean
}
