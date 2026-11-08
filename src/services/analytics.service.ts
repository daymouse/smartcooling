import { DEVICE_ID } from '@/config/env'
import { supabase } from '@/lib/supabase'
import type { TemperatureBucket, TemperatureStats } from '@/types/telemetry'

function requireClient() {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY).')
  return supabase
}

export function rangeBounds(minutes: number, now = new Date()) {
  return { start: new Date(now.getTime() - minutes * 60_000).toISOString(), end: now.toISOString() }
}

export async function fetchTemperatureStats(minutes: number): Promise<TemperatureStats> {
  const client = requireClient()
  const { start, end } = rangeBounds(minutes)
  const { data, error } = await client.rpc('get_temperature_average', {
    p_device_id: DEVICE_ID,
    p_start_time: start,
    p_end_time: end,
  })
  if (error) throw new Error(error.message)
  const row = (Array.isArray(data) ? data[0] : data) as Partial<TemperatureStats> | null
  return {
    average_temperature: row?.average_temperature ?? null,
    minimum_temperature: row?.minimum_temperature ?? null,
    maximum_temperature: row?.maximum_temperature ?? null,
    total_readings: Number(row?.total_readings ?? 0),
  }
}

export async function fetchTemperatureHistory(minutes: number): Promise<TemperatureBucket[]> {
  const client = requireClient()
  const { start, end } = rangeBounds(minutes)
  const { data, error } = await client.rpc('get_temperature_history_per_minute', {
    p_device_id: DEVICE_ID,
    p_start_time: start,
    p_end_time: end,
  })
  if (error) throw new Error(error.message)
  return ((data ?? []) as TemperatureBucket[]).map((r) => ({
    bucket_minute: r.bucket_minute,
    average_temperature: Number(r.average_temperature),
  }))
}
