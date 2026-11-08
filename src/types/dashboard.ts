export type RangeKey = '15m' | '30m' | '1h'

export const RANGE_OPTIONS: { key: RangeKey; label: string; minutes: number }[] = [
  { key: '15m', label: '15 Minutes', minutes: 15 },
  { key: '30m', label: '30 Minutes', minutes: 30 },
  { key: '1h', label: '1 Hour', minutes: 60 },
]

export type RealtimeStatus =
  | 'idle'
  | 'connecting'
  | 'subscribed'
  | 'error'
  | 'timed_out'
  | 'closed'
  | 'unconfigured'
  | 'unauthenticated'

export type DeviceStatus = 'online' | 'offline' | 'unknown'
