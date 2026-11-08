import { Droplets, Fan } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { RealtimeTelemetryState } from '@/hooks/useRealtimeTelemetry'
import type { FanLevel } from '@/types/telemetry'
import { formatPercent } from '@/utils/format-temperature'

const LEVEL_TONE: Record<FanLevel, 'neutral' | 'green' | 'amber' | 'orange' | 'red'> = {
  OFF: 'neutral',
  LOW: 'green',
  MEDIUM: 'amber',
  HIGH: 'orange',
  SENSOR_ERROR: 'red',
}

const FAILED = ['error', 'timed_out', 'closed', 'unconfigured', 'unauthenticated']

export function RealtimeOverview({ state }: { state: RealtimeTelemetryState }) {
  const { reading, realtimeStatus, realtimeError, deviceStatus } = state
  const sensorError = reading !== null && (reading.status === 'SENSOR_ERROR' || reading.temperature === null)

  let note = ''
  if (!reading && FAILED.includes(realtimeStatus)) note = realtimeError ?? 'Realtime tidak tersambung.'
  else if (!reading && realtimeStatus === 'subscribed') note = 'Menunggu pembacaan pertama…'
  else if (!reading) note = 'Menghubungkan…'
  else if (sensorError) note = 'Sensor error – tidak ada pembacaan suhu valid.'
  else if (deviceStatus === 'offline') note = 'Perangkat offline – menampilkan nilai terakhir.'

  const temp = reading && !sensorError && reading.temperature !== null ? `${reading.temperature.toFixed(1)}°C` : '--'
  const dim = deviceStatus === 'offline' ? 'text-muted' : ''

  return (
    <section
      aria-label="Realtime data"
      className="rounded-[var(--radius-card)] bg-surface px-6 py-10 shadow-[4px_6px_6px_rgba(0,0,0,0.25)] sm:px-10 sm:py-12"
    >
      <p className={`text-center text-7xl font-light tabular-nums sm:text-9xl ${dim}`}>{temp}</p>
      <p className="mt-3 min-h-5 text-center text-xs text-muted">{note}</p>

      <div className="mt-8 grid grid-cols-3 items-center gap-2 sm:mt-12">
        <div className={`flex items-center justify-center gap-2 text-2xl font-light tabular-nums sm:text-3xl ${dim}`} title="Persentase perintah PWM (bukan RPM aktual)">
          {formatPercent(reading?.fan_percent)}
          <Fan className="size-6 text-blue-700 sm:size-7" />
        </div>
        <div className="flex justify-center">
          {reading ? <Badge tone={LEVEL_TONE[reading.status]}>{reading.status.replace('_', ' ')}</Badge> : <span className="text-2xl font-light text-muted">--</span>}
        </div>
        <div className={`flex items-center justify-center gap-2 text-2xl font-light tabular-nums sm:text-3xl ${dim}`}>
          {formatPercent(reading?.humidity)}
          <Droplets className="size-6 text-blue-700 sm:size-7" />
        </div>
      </div>
    </section>
  )
}
