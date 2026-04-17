import { PieChart } from '@/ui';
import { AWARENESS_CHANNEL_LABELS } from '@/lib/enum-labels';
import type { MetricsMeetingRow } from './metrics-dashboard';

interface ChannelsPieChartProps {
  meetings: MetricsMeetingRow[];
}

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#fb7185', '#22d3ee', '#c084fc', '#f97316', '#a3e635', '#94a3b8'];

export function ChannelsPieChart({ meetings }: ChannelsPieChartProps) {
  const counts = meetings.reduce<Record<string, number>>((acc, meeting) => {
    const key = meeting.meetingCategory?.awarenessChannel;
    if (!key) return acc;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts)
    .map(([key, value], index) => ({
      name: AWARENESS_CHANNEL_LABELS[key as keyof typeof AWARENESS_CHANNEL_LABELS],
      value,
      color: COLORS[index % COLORS.length],
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return <p>No hay categorías suficientes para este gráfico.</p>;
  }

  return <PieChart data={data} height={320} />;
}
