import { formatInTimeZone } from 'date-fns-tz'

const TZ = 'Asia/Jakarta'

export function formatDateTime(value: string | Date | number | null | undefined): string {
  if (value === null || value === undefined) return '--'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '--' : formatInTimeZone(d, TZ, 'dd MMM yyyy, HH:mm:ss')
}

export function formatClock(value: string | Date | number | null | undefined, withSeconds = false): string {
  if (value === null || value === undefined) return '--'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '--' : formatInTimeZone(d, TZ, withSeconds ? 'HH:mm:ss' : 'HH:mm')
}

/** yyyy-MM-dd day boundaries in Asia/Jakarta, returned as UTC ISO strings. */
export function jakartaDayStartIso(day: string): string {
  return new Date(`${day}T00:00:00+07:00`).toISOString()
}
export function jakartaDayEndIso(day: string): string {
  return new Date(`${day}T23:59:59.999+07:00`).toISOString()
}
