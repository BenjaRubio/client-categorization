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
  xAxisLabel?: string;
  yAxisLabel?: string;
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

const axisTickStyle = { fill: 'var(--foreground)', fontSize: 13 };

export const ScatterChart = ({
  data,
  xDomain = [0.5, 3.5],
  yDomain = [0.5, 3.5],
  zRange = [40, 400],
  xTicks = [1, 2, 3],
  yTicks = [1, 2, 3],
  xTickFormatter,
  yTickFormatter,
  xAxisLabel,
  yAxisLabel,
  height = 400,
  className = '',
  renderTooltip,
}: ScatterChartProps) => {
  const margin = {
    top: 20,
    right: 20,
    bottom: xAxisLabel ? 48 : 28,
    left: yAxisLabel ? 64 : 52,
  };

  return (
  <div className={`${styles.container} ${className}`}>
    <ResponsiveContainer width="100%" height={height}>
      <RechartsScatter margin={margin}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          type="number"
          dataKey="x"
          domain={xDomain}
          ticks={xTicks}
          tickFormatter={xTickFormatter}
          tick={axisTickStyle}
          axisLine={{ stroke: 'var(--border)' }}
          tickLine={false}
          label={
            xAxisLabel
              ? {
                  value: xAxisLabel,
                  position: 'insideBottom',
                  offset: -10,
                  fill: 'var(--foreground)',
                  fontSize: '1rem',
                  fontWeight: 600,
                }
              : undefined
          }
        />
        <YAxis
          type="number"
          dataKey="y"
          domain={yDomain}
          ticks={yTicks}
          tickFormatter={yTickFormatter}
          tick={axisTickStyle}
          axisLine={{ stroke: 'var(--border)' }}
          tickLine={false}
          label={
            yAxisLabel
              ? {
                  value: yAxisLabel,
                  angle: -90,
                  position: 'insideLeft',
                  fill: 'var(--foreground)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  dx: -10,
                }
              : undefined
          }
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
};
