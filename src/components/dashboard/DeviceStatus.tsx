import { Wifi, WifiOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { DeviceStatus as Status, RealtimeStatus } from '@/types/dashboard'

const DEVICE: Record<Status, { label: string; tone: 'green' | 'red' | 'neutral' }> = {
  online: { label: 'Online', tone: 'green' },
  offline: { label: 'Offline', tone: 'red' },
  unknown: { label: 'No data yet', tone: 'neutral' },
}

const REALTIME: Record<RealtimeStatus, { label: string; ok: boolean }> = {
  idle: { label: 'Idle', ok: false },
  connecting: { label: 'Connecting...', ok: false },
  subscribed: { label: 'Realtime connected', ok: true },
  error: { label: 'Realtime error', ok: false },
  timed_out: { label: 'Realtime timed out', ok: false },
  closed: { label: 'Realtime closed', ok: false },
  unconfigured: { label: 'Supabase not configured', ok: false },
  unauthenticated: { label: 'Auth required', ok: false },
}

export function DeviceStatusBadge({ status }: { status: Status }) {
  const d = DEVICE[status]
  return (
    <Badge tone={d.tone} className="py-0.5" aria-label={`Device ${d.label}`}>
      {d.label}
    </Badge>
  )
}

export function RealtimeIndicator({ status, detail }: { status: RealtimeStatus; detail?: string | null }) {
  const r = REALTIME[status]
  const Icon = r.ok ? Wifi : WifiOff
  return (
    <span title={detail ?? undefined} className={`inline-flex items-center gap-1.5 text-xs ${r.ok ? 'text-accent' : 'text-muted'}`}>
      <Icon className="size-3.5" />
      {r.label}
    </span>
  )
}
