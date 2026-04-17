import { PieChart } from '@/ui';
import { USE_CASE_LABELS } from '@/lib/enum-labels';
import type { MetricsMeetingRow } from './metrics-dashboard';

interface UseCasePieChartProps {
  meetings: MetricsMeetingRow[];
}

const COLORS = ['#38bdf8', '#a78bfa', '#fb7185', '#f59e0b', '#10b981'];

export function UseCasePieChart({ meetings }: UseCasePieChartProps) {
  const counts = meetings.reduce<Record<string, number>>((acc, meeting) => {
    const key = meeting.meetingCategory?.useCase;
    if (!key) return acc;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts)
    .map(([key, value], index) => ({
      name: USE_CASE_LABELS[key as keyof typeof USE_CASE_LABELS],
      value,
      color: COLORS[index % COLORS.length],
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return <p>No hay categorías suficientes para este gráfico.</p>;
  }

  return <PieChart data={data} height={320} />;
}
