'use client';

import React from 'react';
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './styles/chart.module.css';

export interface BarDef {
  key: string;
  label: string;
  color: string;
  stackId?: string;
}

interface BarChartProps {
  data: Record<string, unknown>[];
  bars: BarDef[];
  categoryKey: string;
  height?: number;
  showLegend?: boolean;
  className?: string;
  tooltipContent?: React.ComponentProps<typeof Tooltip>['content'];
}

export const BarChart = ({
  data,
  bars,
  categoryKey,
  height = 300,
  showLegend = true,
  className = '',
  tooltipContent,
}: BarChartProps) => (
  <div className={`${styles.container} ${className}`}>
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBar data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey={categoryKey}
          tick={{ fill: 'var(--muted-foreground)', fontSize: '0.875rem' }}
          axisLine={{ stroke: 'var(--border)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--muted-foreground)', fontSize: '0.875rem' }}
          axisLine={{ stroke: 'var(--border)' }}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          cursor={false}
          content={tooltipContent}
          contentStyle={
            tooltipContent
              ? undefined
              : {
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                }
          }
        />
        {showLegend && (
          <Legend
            wrapperStyle={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}
          />
        )}
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.label}
            fill={bar.color}
            stackId={bar.stackId}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBar>
    </ResponsiveContainer>
  </div>
);
