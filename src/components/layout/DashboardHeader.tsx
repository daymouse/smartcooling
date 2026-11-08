
import { DeviceStatusBadge } from '@/components/dashboard/DeviceStatus'
import type { DeviceStatus, RealtimeStatus } from '@/types/dashboard'

interface Props {
  deviceStatus: DeviceStatus
  realtimeStatus: RealtimeStatus
  realtimeError: string | null
  lastReceivedAt: number | null
}

export function DashboardHeader({
  deviceStatus,
}: Props) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-1 sm:gap-4">\
      <div className="min-w-0 flex-1">
        <h1 className="text-[clamp(1.25rem,4vw,1.875rem)] font-semibold leading-tight tracking-tight">
          Smart Cooling Fan
        </h1>
        <p className="mt-1 text-[clamp(0.75rem,2vw,0.875rem)] text-muted-foreground">
          IoT Monitoring Dashboard
        </p>
      </div>
      <div className="flex shrink-0 items-center">
        <DeviceStatusBadge status={deviceStatus} />
      </div>
    </header>
  )
}
