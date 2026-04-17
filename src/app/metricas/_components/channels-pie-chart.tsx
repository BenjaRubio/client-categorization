import type { TooltipContentProps } from 'recharts';
import { BarChart } from '@/ui';
import chartStyles from '@/ui/styles/chart.module.css';
import { AWARENESS_CHANNEL_LABELS } from '@/lib/enum-labels';
import type { MetricsMeetingRow } from './metrics-dashboard';

interface ChannelsPieChartProps {
  meetings: MetricsMeetingRow[];
}

type ChannelBarRow = {
  canal: string;
  cerradas: number;
  abiertas: number;
  total: number;
};

function formatPct(part: number, total: number): string {
  if (total <= 0) return '0';
  return new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format((part / total) * 100);
}

function ChannelsBarTooltip({ active, label, payload }: TooltipContentProps) {
  if (!active || payload.length === 0) return null;
  const row = payload[0]?.payload as ChannelBarRow | undefined;
  if (!row) return null;
  const cerradas = row.cerradas ?? 0;
  const abiertas = row.abiertas ?? 0;
  const total = cerradas + abiertas;
  const pctCerradas = formatPct(cerradas, total);
  const pctAbiertas = formatPct(abiertas, total);
  const title = label != null && label !== '' ? String(label) : row.canal;

  return (
    <div className={chartStyles.tooltip}>
      <p className={chartStyles.tooltipLabel}>{title}</p>
      <p className={chartStyles.tooltipItem}>
        Cerradas: <strong>{cerradas}</strong> ({pctCerradas}%)
      </p>
      <p className={chartStyles.tooltipItem}>
        Abiertas: <strong>{abiertas}</strong> ({pctAbiertas}%)
      </p>
    </div>
  );
}

export function ChannelsPieChart({ meetings }: ChannelsPieChartProps) {
  const summaryMap = meetings.reduce<Record<string, { closed: number; open: number }>>(
    (acc, meeting) => {
    const key = meeting.meetingCategory?.awarenessChannel;
      if (!key) return acc;

      if (!acc[key]) {
        acc[key] = { closed: 0, open: 0 };
      }

      if (meeting.closed) {
        acc[key].closed += 1;
      } else {
        acc[key].open += 1;
      }

      return acc;
    },
    {}
  );

  const data: ChannelBarRow[] = Object.entries(summaryMap)
    .map(([key, values]) => ({
      canal: AWARENESS_CHANNEL_LABELS[key as keyof typeof AWARENESS_CHANNEL_LABELS],
      cerradas: values.closed,
      abiertas: values.open,
      total: values.closed + values.open,
    }))
    .sort((a, b) => b.total - a.total);

  if (data.length === 0) {
    return <p>No hay reuniones categorizadas para mostrar en este gráfico.</p>;
  }

  return (
    <BarChart
      data={data}
      categoryKey="canal"
      bars={[
        { key: 'cerradas', label: 'Cerradas', color: '#4ade80', stackId: 'canales' },
        { key: 'abiertas', label: 'Abiertas', color: '#facc15', stackId: 'canales' },
      ]}
      height={320}
      tooltipContent={ChannelsBarTooltip}
    />
  );
}
