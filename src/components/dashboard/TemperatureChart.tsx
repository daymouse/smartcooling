import { useMemo, useState } from 'react'
import { CartesianGrid, Line, LineChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTemperatureHistory } from '@/hooks/useTemperatureAverage'
import { RANGE_OPTIONS, type RangeKey } from '@/types/dashboard'
import { formatClock } from '@/utils/format-date'

export function TemperatureChart() {
  const [range, setRange] = useState<RangeKey>('15m')
  const { data, isPending, isError, error } = useTemperatureHistory(range)

  const points = useMemo(
    () => (data ?? []).map((d) => ({ label: formatClock(d.bucket_minute), temp: d.average_temperature })),
    [data],
  )
  const step = Math.max(1, Math.ceil(points.length / 7)) 

  return (
    <section
      aria-label="Temperature chart"
      className="rounded-[var(--radius-card)] bg-surface px-5 py-6 shadow-[4px_6px_6px_rgba(0,0,0,0.25)] sm:px-10 sm:py-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg">Chart</h2>
        <div className="inline-flex rounded-full bg-neutral-200 p-1" role="group" aria-label="Time range">
          {RANGE_OPTIONS.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              aria-pressed={range === r.key}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${range === r.key ? 'bg-surface text-ink shadow-sm' : 'text-muted'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-72 w-full sm:h-96">
        {isPending ? (
          <p className="flex h-full items-center justify-center text-sm text-muted">Memuat data…</p>
        ) : isError ? (
          <p className="flex h-full items-center justify-center px-4 text-center text-sm text-red-600">Gagal memuat grafik: {error.message}</p>
        ) : points.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-muted">Belum ada data pada rentang ini.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 24, right: 24, bottom: 4, left: 0 }}>
              <CartesianGrid stroke="#e0e0e0" vertical={false} />
              <XAxis dataKey="label" interval={step - 1} tick={{ fontSize: 11, fill: '#1d1d1f' }} axisLine={{ stroke: '#1d1d1f' }} tickLine={false} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} tickFormatter={(v: number) => v.toFixed(0)} tick={{ fontSize: 11, fill: '#6e6e73' }} axisLine={{ stroke: '#1d1d1f' }} tickLine={false} width={32} />
              <Tooltip
                formatter={(v) => [`${Number(v).toFixed(2)}°C`, 'Average']}
                labelFormatter={(l) => `${l} WIB`}
                contentStyle={{ borderRadius: 12, border: '1px solid #e5e5ea', fontSize: 12 }}
              />
              <Line type="linear" dataKey="temp" stroke="#1d1d1f" strokeWidth={1.25} dot={{ r: 2.5, fill: '#1d1d1f' }} isAnimationActive={false}>
                <LabelList
                  dataKey="temp"
                  position="top"
                  content={(p) => {
                    const { x, y, value, index } = p as { x: number; y: number; value: number; index: number }
                    if (index % step !== 0) return null
                    return (
                      <text x={x} y={y - 8} textAnchor="middle" fontSize={11} fill="#1d1d1f">
                        {Number(value).toFixed(0)}°C
                      </text>
                    )
                  }}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  )
}
