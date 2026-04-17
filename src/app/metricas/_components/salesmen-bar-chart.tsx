import { BarChart } from '@/ui';
import type { MetricsMeetingRow } from './metrics-dashboard';

interface SalesmenBarChartProps {
  meetings: MetricsMeetingRow[];
}

export function SalesmenBarChart({ meetings }: SalesmenBarChartProps) {
  const summaryMap = meetings.reduce<Record<string, { closed: number; open: number }>>(
    (acc, meeting) => {
      const name = meeting.salesman.name;
      if (!acc[name]) {
        acc[name] = { closed: 0, open: 0 };
      }
      if (meeting.closed) {
        acc[name].closed += 1;
      } else {
        acc[name].open += 1;
      }
      return acc;
    },
    {}
  );

  const data = Object.entries(summaryMap)
    .map(([salesman, values]) => ({
      salesman,
      cerradas: values.closed,
      abiertas: values.open,
      total: values.closed + values.open,
    }))
    .sort((a, b) => b.total - a.total);

  if (data.length === 0) {
    return <p>No hay reuniones para mostrar en este filtro.</p>;
  }

  return (
    <BarChart
      data={data}
      categoryKey="salesman"
      bars={[
        { key: 'cerradas', label: 'Cerradas', color: '#4ade80', stackId: 'ventas' },
        { key: 'abiertas', label: 'Abiertas', color: '#facc15', stackId: 'ventas' },
      ]}
      height={320}
    />
  );
}
