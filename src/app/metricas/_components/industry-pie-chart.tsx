import { PieChart } from '@/ui';
import { INDUSTRY_LABELS } from '@/lib/enum-labels';
import type { MetricsMeetingRow } from './metrics-dashboard';

interface IndustryPieChartProps {
  meetings: MetricsMeetingRow[];
}

const COLORS = ['#22d3ee', '#4ade80', '#818cf8', '#facc15', '#fb7185', '#a78bfa', '#34d399', '#f97316'];

export function IndustryPieChart({ meetings }: IndustryPieChartProps) {
  const counts = meetings.reduce<Record<string, number>>((acc, meeting) => {
    const key = meeting.meetingCategory?.industry;
    if (!key) return acc;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts)
    .map(([key, value], index) => ({
      name: INDUSTRY_LABELS[key as keyof typeof INDUSTRY_LABELS],
      value,
      color: COLORS[index % COLORS.length],
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return <p>No hay categorías suficientes para este gráfico.</p>;
  }

  return <PieChart data={data} height={320} />;
}
