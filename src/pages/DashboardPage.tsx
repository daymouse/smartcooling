import { RealtimeOverview } from '@/components/dashboard/RealtimeOverview'
import { TemperatureChart } from '@/components/dashboard/TemperatureChart'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useRealtimeTelemetry } from '@/hooks/useRealtimeTelemetry'

export default function DashboardPage() {
  const telemetry = useRealtimeTelemetry() 
  return (
    <DashboardLayout>
      <DashboardHeader
        deviceStatus={telemetry.deviceStatus}
        realtimeStatus={telemetry.realtimeStatus}
        realtimeError={telemetry.realtimeError}
        lastReceivedAt={telemetry.lastReceivedAt}
      />
      <RealtimeOverview state={telemetry} />
      <TemperatureChart />
    </DashboardLayout>
  )
}
