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
  showTotal?: boolean;
  className?: string;
}

export const PieChart = ({
  data,
  height = 300,
  showLegend = true,
  showTotal = true,
  className = '',
}: PieChartProps) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className={`${styles.container} ${className}`}>
      {showTotal && total > 0 && (
        <p className={styles.pieTotal}>
          Total: <strong>{total}</strong>
        </p>
      )}
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
            fontSize="0.875rem"
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
              fontSize: '0.875rem'
            }}
          />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}
            />
          )}
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  );
};
