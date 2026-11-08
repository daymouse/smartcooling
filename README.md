# Smart Cooling Fan Monitoring Dashboard

Arduino Uno + DHT11 → Python Gateway → Supabase (Realtime Broadcast + PostgreSQL) → this React dashboard.

Stack: React 19, Vite, TypeScript, Tailwind CSS v4, Radix/shadcn-style UI, Lucide, Supabase JS,
TanStack Query, Recharts, React Router, date-fns.

## Setup

```bash
npm install
cp .env.example .env   # fill in VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
```

1. Apply `supabase/migrations/20261107000000_temperature_analytics.sql` (creates
   `get_temperature_average` and `get_temperature_history_per_minute`).
2. Configure RLS and the JWT for the private channel: see [docs/REALTIME.md](docs/REALTIME.md).

## Run

```bash
npm run dev        # development
npx tsc -b         # type check
npm run build      # production build -> dist/
npm run preview    # serve the build
```

## Notes

- Fan Speed is the PWM command percentage (`fan_percent`, or `pwm / 255 * 100`), not measured RPM.
- Statistics and the per-minute chart are computed in SQL; readings with NULL temperature or
  `SENSOR_ERROR` are excluded.
- History uses server-side pagination (10 rows/page) with date and fan-level filters; timestamps are shown in Asia/Jakarta.
- The frontend never writes to the database; the Python Gateway stores readings.
- Humidity is received but intentionally not displayed.
