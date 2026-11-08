export const FAN_LEVELS = ['OFF', 'LOW', 'MEDIUM', 'HIGH', 'SENSOR_ERROR'] as const
export type FanLevel = (typeof FAN_LEVELS)[number]

export interface SensorReading {
  device_id: string
  raw_temperature: number | null
  temperature: number | null
  humidity: number | null
  pwm: number
  fan_percent: number
  status: FanLevel
}

export interface TelemetryRow {
  id: number
  device_id: string
  raw_temperature: number | null
  temperature: number | null
  pwm: number
  fan_percent: number
  status: string
  recorded_at: string
}

export interface TemperatureStats {
  average_temperature: number | null
  minimum_temperature: number | null
  maximum_temperature: number | null
  total_readings: number
}

export interface TemperatureBucket {
  bucket_minute: string
  average_temperature: number
}
