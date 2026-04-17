'use client';

import React from 'react';
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './styles/chart.module.css';

export interface PieChartDatum {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartDatum[];
  height?: number;
  showLegend?: boolean;
  className?: string;
}

export const PieChart = ({
  data,
  height = 300,
  showLegend = true,
  className = '',
}: PieChartProps) => (
  <div className={`${styles.container} ${className}`}>
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPie>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="70%"
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) =>
            `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
          }
          labelLine={false}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
          }}
        />
        {showLegend && (
          <Legend
            wrapperStyle={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}
          />
        )}
      </RechartsPie>
    </ResponsiveContainer>
  </div>
);
