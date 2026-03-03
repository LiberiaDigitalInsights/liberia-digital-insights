import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const sample = [
  { day: 'Mon', visits: 320 },
  { day: 'Tue', visits: 420 },
  { day: 'Wed', visits: 380 },
  { day: 'Thu', visits: 510 },
  { day: 'Fri', visits: 460 },
  { day: 'Sat', visits: 390 },
  { day: 'Sun', visits: 520 },
];

export default function TrafficChart({ data = sample, height = 180 }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="brandFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-brand-500)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-brand-500)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis dataKey="day" stroke="var(--color-muted)" tickMargin={6} />
          <YAxis stroke="var(--color-muted)" tickMargin={6} />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
          <Area
            type="monotone"
            dataKey="visits"
            stroke="var(--color-brand-500)"
            fill="url(#brandFill)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
