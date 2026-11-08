import { useEffect, useState } from 'react'
import { env } from '@/config/env'
import { subscribeToTelemetry } from '@/services/realtime.service'
import type { DeviceStatus, RealtimeStatus } from '@/types/dashboard'
import type { SensorReading } from '@/types/telemetry'

export interface RealtimeTelemetryState {
  reading: SensorReading | null
  lastReceivedAt: number | null
  realtimeStatus: RealtimeStatus
  realtimeError: string | null
  invalidCount: number
  deviceStatus: DeviceStatus
}

export function useRealtimeTelemetry(): RealtimeTelemetryState {
  const [reading, setReading] = useState<SensorReading | null>(null)
  const [lastReceivedAt, setLastReceivedAt] = useState<number | null>(null)
  const [realtimeStatus, setRealtimeStatus] = useState<RealtimeStatus>('idle')
  const [realtimeError, setRealtimeError] = useState<string | null>(null)
  const [invalidCount, setInvalidCount] = useState(0)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    return subscribeToTelemetry({
      onReading: (r) => {
        setReading(r)
        setLastReceivedAt(Date.now())
      },
      onStatus: (s, detail) => {
        setRealtimeStatus(s)
        setRealtimeError(detail ?? null)
      },
      onInvalidPayload: () => setInvalidCount((c) => c + 1),
    })
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const deviceStatus: DeviceStatus =
    lastReceivedAt === null ? 'unknown' : now - lastReceivedAt <= env.offlineTimeoutMs ? 'online' : 'offline'

  return { reading, lastReceivedAt, realtimeStatus, realtimeError, invalidCount, deviceStatus }
}
