import type { ServerStatus } from '@/lib/types'

export function formatUptime(seconds: number) {
  if (seconds <= 0) return '—'
  const days = Math.floor(seconds / 86_400)
  const hours = Math.floor((seconds % 86_400) / 3_600)
  const minutes = Math.floor((seconds % 3_600) / 60)
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}min`
  return `${minutes}min`
}

export function formatRam(usedGb: number, totalGb: number) {
  return `${usedGb.toFixed(1)} / ${totalGb.toFixed(0)} GB`
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatShortTime(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeMinutes(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.max(0, Math.round(diffMs / 60_000))
  if (minutes < 1) return 'agora'
  if (minutes < 60) return `há ${minutes} min`
  const hours = Math.floor(minutes / 60)
  return `há ${hours}h`
}

export const serverStatusLabel: Record<ServerStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  starting: 'Iniciando',
  stopping: 'Parando',
}

export function getPingQuality(pingMs: number): 'good' | 'fair' | 'poor' {
  if (pingMs < 60) return 'good'
  if (pingMs < 120) return 'fair'
  return 'poor'
}
