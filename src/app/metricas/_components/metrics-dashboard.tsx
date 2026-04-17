'use client';

import { useMemo, useState } from 'react';
import type {
  AwarenessChannel,
  Industry,
  IntegrationLevel,
  Seasonality,
  Urgency,
  UseCase,
  WeeklyVolume,
} from '@prisma/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Select } from '@/ui';
import { SalesmenBarChart } from './salesmen-bar-chart';
import { ChannelsPieChart } from './channels-pie-chart';
import { UseCasePieChart } from './use-case-pie-chart';
import { IndustryPieChart } from './industry-pie-chart';
import { SegmentationMatrix } from './segmentation-matrix';
import styles from './styles/metrics-dashboard.module.css';

type ClosedFilter = 'all' | 'closed' | 'open';

const CLOSED_FILTER_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'closed', label: 'Solo cerradas' },
  { value: 'open', label: 'Solo abiertas' },
];

export interface MetricsMeetingRow {
  id: string;
  closed: boolean;
  client: { id: string; name: string };
  salesman: { id: string; name: string };
  meetingCategory: {
    weeklyVolume: WeeklyVolume;
    useCase: UseCase;
    industry: Industry;
    awarenessChannel: AwarenessChannel;
    seasonality: Seasonality;
    integrationLevel: IntegrationLevel;
    urgency: Urgency;
  } | null;
}

interface MetricsDashboardProps {
  meetings: MetricsMeetingRow[];
}

export function MetricsDashboard({ meetings }: MetricsDashboardProps) {
  const [closedFilter, setClosedFilter] = useState<ClosedFilter>('all');

  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      if (closedFilter === 'closed') return meeting.closed;
      if (closedFilter === 'open') return !meeting.closed;
      return true;
    });
  }, [meetings, closedFilter]);

  const categorizedMeetings = useMemo(
    () => filteredMeetings.filter((meeting) => meeting.meetingCategory !== null),
    [filteredMeetings]
  );

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <label className={styles.filterLabel}>Filtro global</label>
          <Select
            options={CLOSED_FILTER_OPTIONS}
            value={closedFilter}
            onChange={(value) => setClosedFilter(value as ClosedFilter)}
          />
        </div>
      </div>

      <div className={styles.gridTwo}>
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Reuniones por vendedor</CardTitle>
            <CardDescription>Total, cerradas y abiertas por vendedor</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesmenBarChart meetings={filteredMeetings} />
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>Canales de adquisición</CardTitle>
            <CardDescription>Distribución de canales de adquisición</CardDescription>
          </CardHeader>
          <CardContent>
            <ChannelsPieChart meetings={categorizedMeetings} />
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>Servicios solicitados</CardTitle>
            <CardDescription>Distribución por caso de uso</CardDescription>
          </CardHeader>
          <CardContent>
            <UseCasePieChart meetings={categorizedMeetings} />
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>Industrias principales</CardTitle>
            <CardDescription>Distribución por industria</CardDescription>
          </CardHeader>
          <CardContent>
            <IndustryPieChart meetings={categorizedMeetings} />
          </CardContent>
        </Card>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Matriz de segmentación</CardTitle>
          <CardDescription>
            Identificación de oportunidades por cliente según la urgencia, esfuerzo requerido,
            volumen demandado y estacionalidad.
            <br />
            El tamaño de la circunferencia es proporcional al volumen demandado.            
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SegmentationMatrix meetings={categorizedMeetings} />
        </CardContent>
      </Card>
    </div>
  );
}
