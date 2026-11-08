import type { RealtimeChannel } from '@supabase/supabase-js'
import { DEVICE_ID, REALTIME_CHANNEL, REALTIME_EVENT, env } from '@/config/env'
import { supabase } from '@/lib/supabase'
import type { RealtimeStatus } from '@/types/dashboard'
import { FAN_LEVELS, type FanLevel, type SensorReading } from '@/types/telemetry'

const isNumOrNull = (v: unknown): v is number | null =>
  v === null || (typeof v === 'number' && Number.isFinite(v))

export function parseSensorPayload(input: unknown): SensorReading | null {
  if (typeof input !== 'object' || input === null) return null
  const p = input as Record<string, unknown>

  if (p.device_id !== DEVICE_ID) return null
  if (typeof p.pwm !== 'number' || !Number.isFinite(p.pwm) || p.pwm < 0 || p.pwm > 255) return null
  if (typeof p.status !== 'string' || !(FAN_LEVELS as readonly string[]).includes(p.status)) return null

  const temperature = p.temperature ?? null
  const raw = p.raw_temperature ?? null
  const humidity = p.humidity ?? null
  if (!isNumOrNull(temperature) || !isNumOrNull(raw) || !isNumOrNull(humidity)) return null

  let fanPercent: number
  if (typeof p.fan_percent === 'number' && Number.isFinite(p.fan_percent)) {
    fanPercent = p.fan_percent
  } else {
    fanPercent = Math.round((p.pwm / 255) * 100)
  }

  return {
    device_id: DEVICE_ID,
    raw_temperature: raw,
    temperature,
    humidity,
    pwm: p.pwm,
    fan_percent: fanPercent,
    status: p.status as FanLevel,
  }
}

export interface RealtimeHandlers {
  onReading: (reading: SensorReading) => void
  onStatus: (status: RealtimeStatus, detail?: string) => void
  onInvalidPayload: () => void
}

export function subscribeToTelemetry(handlers: RealtimeHandlers): () => void {
  const client = supabase
  if (!client) {
    handlers.onStatus('unconfigured', 'VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY belum diisi.')
    return () => {}
  }

  let cancelled = false
  let channel: RealtimeChannel | null = null

  const start = async () => {
    handlers.onStatus('connecting')

    if (cancelled) return

    const topic = `realtime:${REALTIME_CHANNEL}`
    await Promise.all(client.getChannels().filter((c) => c.topic === topic).map((c) => client.removeChannel(c)))
    if (cancelled) return

    channel = client
      .channel(REALTIME_CHANNEL, { config: { private: false } })
      .on('broadcast', { event: REALTIME_EVENT }, (message) => {
        const body = (message as { payload?: unknown }).payload
        const reading = parseSensorPayload(body)
        if (reading) handlers.onReading(reading)
        else handlers.onInvalidPayload()
      })
      .subscribe((status, err) => {
        if (cancelled) return
        switch (status) {
          case 'SUBSCRIBED':
            handlers.onStatus('subscribed')
            break
          case 'CHANNEL_ERROR':
            handlers.onStatus('error', err?.message ?? 'Gagal subscribe. Periksa JWT dan RLS realtime.messages.')
            break
          case 'TIMED_OUT':
            handlers.onStatus('timed_out', 'Subscription timeout.')
            break
          case 'CLOSED':
            handlers.onStatus('closed')
            break
        }
      })
  }

  void start()

  return () => {
    cancelled = true
    if (channel) void client.removeChannel(channel)
  }
}
