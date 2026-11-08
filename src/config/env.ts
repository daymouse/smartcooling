export const DEVICE_ID = 'smartfan'
export const REALTIME_CHANNEL = 'device:smartfan'
export const REALTIME_EVENT = 'sensor_reading'

const timeout = Number(import.meta.env.VITE_DEVICE_OFFLINE_TIMEOUT_SECONDS)

export const env = {
  supabaseUrl: (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ?? '',
  supabaseKey: (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)?.trim() ?? '',
  realtimeJwt: (import.meta.env.VITE_SUPABASE_REALTIME_JWT as string | undefined)?.trim() ?? '',
  offlineTimeoutMs: (Number.isFinite(timeout) && timeout > 0 ? timeout : 10) * 1000,
}

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseKey)
