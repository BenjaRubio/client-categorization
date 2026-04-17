'use client';

import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import type {
  AwarenessChannel,
  Industry,
  IntegrationLevel,
  Seasonality,
  Urgency,
  UseCase,
  WeeklyVolume,
} from '@prisma/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  type SelectOption,
} from '@/ui';
import {
  EMPTY_CATEGORY_FILTERS,
  hasActiveCategoryFilters,
  matchesCategoryFilters,
} from '@/ui/filters';
import { SlidersHorizontal } from 'lucide-react';
import { SalesmenBarChart } from './salesmen-bar-chart';
import { ChannelsPieChart } from './channels-pie-chart';
import { UseCasePieChart } from './use-case-pie-chart';
import { IndustryPieChart } from './industry-pie-chart';
import { SegmentationMatrix } from './segmentation-matrix';
import { MetricsFiltersDrawer, type ClosedFilter } from './metrics-filters-drawer';
import styles from './styles/metrics-dashboard.module.css';

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [closedFilter, setClosedFilter] = useState<ClosedFilter>('all');
  const [salesmanId, setSalesmanId] = useState<string>('all');
  const [clientId, setClientId] = useState<string>('all');
  const [weeklyVolume, setWeeklyVolume] = useState<WeeklyVolume[]>(EMPTY_CATEGORY_FILTERS.weeklyVolume);
  const [useCase, setUseCase] = useState<UseCase[]>(EMPTY_CATEGORY_FILTERS.useCase);
  const [industry, setIndustry] = useState<Industry[]>(EMPTY_CATEGORY_FILTERS.industry);
  const [awarenessChannel, setAwarenessChannel] = useState<AwarenessChannel[]>(
    EMPTY_CATEGORY_FILTERS.awarenessChannel
  );
  const [seasonality, setSeasonality] = useState<Seasonality[]>(EMPTY_CATEGORY_FILTERS.seasonality);
  const [integrationLevel, setIntegrationLevel] = useState<IntegrationLevel[]>(
    EMPTY_CATEGORY_FILTERS.integrationLevel
  );
  const [urgency, setUrgency] = useState<Urgency[]>(EMPTY_CATEGORY_FILTERS.urgency);

  const categoryFilters = {
    weeklyVolume,
    useCase,
    industry,
    awarenessChannel,
    seasonality,
    integrationLevel,
    urgency,
  };

  const toggleValue = <T extends string>(setter: Dispatch<SetStateAction<T[]>>, value: T) => {
    setter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      if (closedFilter === 'closed' && !meeting.closed) return false;
      if (closedFilter === 'open' && meeting.closed) return false;
      if (salesmanId !== 'all' && meeting.salesman.id !== salesmanId) return false;
      if (clientId !== 'all' && meeting.client.id !== clientId) return false;
      if (!matchesCategoryFilters(meeting.meetingCategory, categoryFilters)) return false;
      return true;
    });
  }, [
    meetings,
    closedFilter,
    salesmanId,
    clientId,
    weeklyVolume,
    useCase,
    industry,
    awarenessChannel,
    seasonality,
    integrationLevel,
    urgency,
  ]);

  const categorizedMeetings = useMemo(
    () => filteredMeetings.filter((meeting) => meeting.meetingCategory !== null),
    [filteredMeetings]
  );

  const salesmanOptions = useMemo<SelectOption[]>(() => {
    const names = new Map<string, string>();
    meetings.forEach((meeting) => names.set(meeting.salesman.id, meeting.salesman.name));
    const options = Array.from(names, ([value, label]) => ({ value, label }));
    options.sort((a, b) => a.label.localeCompare(b.label, 'es'));
    return [{ value: 'all', label: 'Todos los vendedores' }, ...options];
  }, [meetings]);

  const clientOptions = useMemo<SelectOption[]>(() => {
    const names = new Map<string, string>();
    meetings.forEach((meeting) => names.set(meeting.client.id, meeting.client.name));
    const options = Array.from(names, ([value, label]) => ({ value, label }));
    options.sort((a, b) => a.label.localeCompare(b.label, 'es'));
    return [{ value: 'all', label: 'Todos los clientes' }, ...options];
  }, [meetings]);

  const filtersAreDefault =
    closedFilter === 'all' &&
    salesmanId === 'all' &&
    clientId === 'all' &&
    !hasActiveCategoryFilters(categoryFilters);

  const clearFilters = () => {
    setClosedFilter('all');
    setSalesmanId('all');
    setClientId('all');
    setWeeklyVolume([]);
    setUseCase([]);
    setIndustry([]);
    setAwarenessChannel([]);
    setSeasonality([]);
    setIntegrationLevel([]);
    setUrgency([]);
  };

  const activeFiltersCount =
    (closedFilter !== 'all' ? 1 : 0) +
    (salesmanId !== 'all' ? 1 : 0) +
    (clientId !== 'all' ? 1 : 0) +
    weeklyVolume.length +
    useCase.length +
    industry.length +
    awarenessChannel.length +
    seasonality.length +
    integrationLevel.length +
    urgency.length;

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <p className={styles.summary}>
          Reuniones filtradas: <strong>{filteredMeetings.length}</strong> de {meetings.length}
        </p>
        <Button type="button" variant="outline" onClick={() => setDrawerOpen(true)}>
          <SlidersHorizontal size={16} />
          Filtrar {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
        </Button>
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

      <MetricsFiltersDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        salesmanOptions={salesmanOptions}
        clientOptions={clientOptions}
        salesmanId={salesmanId}
        clientId={clientId}
        closedFilter={closedFilter}
        weeklyVolume={weeklyVolume}
        useCase={useCase}
        industry={industry}
        awarenessChannel={awarenessChannel}
        seasonality={seasonality}
        integrationLevel={integrationLevel}
        urgency={urgency}
        onChangeSalesman={setSalesmanId}
        onChangeClient={setClientId}
        onChangeClosed={setClosedFilter}
        onToggleWeeklyVolume={(value) => toggleValue(setWeeklyVolume, value)}
        onToggleUseCase={(value) => toggleValue(setUseCase, value)}
        onToggleIndustry={(value) => toggleValue(setIndustry, value)}
        onToggleAwarenessChannel={(value) => toggleValue(setAwarenessChannel, value)}
        onToggleSeasonality={(value) => toggleValue(setSeasonality, value)}
        onToggleIntegrationLevel={(value) => toggleValue(setIntegrationLevel, value)}
        onToggleUrgency={(value) => toggleValue(setUrgency, value)}
        onClear={clearFilters}
        clearDisabled={filtersAreDefault}
      />
    </div>
  );
}
