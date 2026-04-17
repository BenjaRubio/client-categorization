'use client';

import React from 'react';
import {
  ScatterChart as RechartsScatter,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import styles from './styles/chart.module.css';

export interface ScatterPoint {
  x: number;
  y: number;
  z: number;
  color: string;
  label: string;
  [key: string]: unknown;
}

interface ScatterChartProps {
  data: ScatterPoint[];
  xDomain?: [number, number];
  yDomain?: [number, number];
  zRange?: [number, number];
  xTicks?: number[];
  yTicks?: number[];
  xTickFormatter?: (value: number) => string;
  yTickFormatter?: (value: number) => string;
  height?: number;
  className?: string;
  renderTooltip?: (point: ScatterPoint) => React.ReactNode;
}

interface TooltipPayloadEntry {
  payload?: ScatterPoint;
}

interface TooltipContentArgs {
  active?: boolean;
  payload?: readonly TooltipPayloadEntry[];
  renderTooltip?: (point: ScatterPoint) => React.ReactNode;
}

const DefaultTooltipContent = ({ active, payload, renderTooltip }: TooltipContentArgs) => {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;

  if (renderTooltip) {
    return <div className={styles.tooltip}>{renderTooltip(point)}</div>;
  }

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{point.label}</p>
    </div>
  );
};

export const ScatterChart = ({
  data,
  xDomain = [0.5, 3.5],
  yDomain = [0.5, 3.5],
  zRange = [40, 400],
  xTicks = [1, 2, 3],
  yTicks = [1, 2, 3],
  xTickFormatter,
  yTickFormatter,
  height = 400,
  className = '',
  renderTooltip,
}: ScatterChartProps) => (
  <div className={`${styles.container} ${className}`}>
    <ResponsiveContainer width="100%" height={height}>
      <RechartsScatter margin={{ top: 16, right: 16, bottom: 16, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          type="number"
          dataKey="x"
          domain={xDomain}
          ticks={xTicks}
          tickFormatter={xTickFormatter}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          axisLine={{ stroke: 'var(--border)' }}
          tickLine={false}
        />
        <YAxis
          type="number"
          dataKey="y"
          domain={yDomain}
          ticks={yTicks}
          tickFormatter={yTickFormatter}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          axisLine={{ stroke: 'var(--border)' }}
          tickLine={false}
        />
        <ZAxis type="number" dataKey="z" range={zRange} />
        <Tooltip
          content={(props) => <DefaultTooltipContent {...props} renderTooltip={renderTooltip} />}
        />
        <Scatter data={data}>
          {data.map((point, i) => (
            <Cell key={i} fill={point.color} fillOpacity={0.75} />
          ))}
        </Scatter>
      </RechartsScatter>
    </ResponsiveContainer>
  </div>
);
