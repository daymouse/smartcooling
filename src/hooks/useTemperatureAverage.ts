import { useQuery } from '@tanstack/react-query'
import { DEVICE_ID } from '@/config/env'
import { fetchTemperatureHistory, fetchTemperatureStats } from '@/services/analytics.service'
import { RANGE_OPTIONS, type RangeKey } from '@/types/dashboard'

const minutesOf = (key: RangeKey) => RANGE_OPTIONS.find((r) => r.key === key)!.minutes

export const analyticsKeys = {
  stats: (range: RangeKey) => ['analytics', DEVICE_ID, 'stats', range] as const,
  history: (range: RangeKey) => ['analytics', DEVICE_ID, 'per-minute', range] as const,
}

const REFRESH_MS = 30_000

export function useTemperatureStats(range: RangeKey) {
  return useQuery({
    queryKey: analyticsKeys.stats(range),
    queryFn: () => fetchTemperatureStats(minutesOf(range)),
    refetchInterval: REFRESH_MS,
  })
}

export function useTemperatureHistory(range: RangeKey) {
  return useQuery({
    queryKey: analyticsKeys.history(range),
    queryFn: () => fetchTemperatureHistory(minutesOf(range)),
    refetchInterval: REFRESH_MS,
  })
}
