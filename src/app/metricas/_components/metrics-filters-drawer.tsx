'use client';

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
  Button,
  CheckboxFilterGroup,
  FilterDrawer,
  Select,
  type SelectOption,
  AWARENESS_CHANNEL_FILTER_OPTIONS,
  INDUSTRY_FILTER_OPTIONS,
  INTEGRATION_LEVEL_FILTER_OPTIONS,
  SEASONALITY_FILTER_OPTIONS,
  URGENCY_FILTER_OPTIONS,
  USE_CASE_FILTER_OPTIONS,
  WEEKLY_VOLUME_FILTER_OPTIONS,
} from '@/ui';
import styles from './styles/metrics-filters-drawer.module.css';

export type ClosedFilter = 'all' | 'closed' | 'open';

const CLOSED_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Todas' },
  { value: 'closed', label: 'Solo cerradas' },
  { value: 'open', label: 'Solo abiertas' },
];

interface MetricsFiltersDrawerProps {
  open: boolean;
  onClose: () => void;
  salesmanOptions: SelectOption[];
  clientOptions: SelectOption[];
  salesmanId: string;
  clientId: string;
  closedFilter: ClosedFilter;
  weeklyVolume: WeeklyVolume[];
  useCase: UseCase[];
  industry: Industry[];
  awarenessChannel: AwarenessChannel[];
  seasonality: Seasonality[];
  integrationLevel: IntegrationLevel[];
  urgency: Urgency[];
  onChangeSalesman: (value: string) => void;
  onChangeClient: (value: string) => void;
  onChangeClosed: (value: ClosedFilter) => void;
  onToggleWeeklyVolume: (value: WeeklyVolume) => void;
  onToggleUseCase: (value: UseCase) => void;
  onToggleIndustry: (value: Industry) => void;
  onToggleAwarenessChannel: (value: AwarenessChannel) => void;
  onToggleSeasonality: (value: Seasonality) => void;
  onToggleIntegrationLevel: (value: IntegrationLevel) => void;
  onToggleUrgency: (value: Urgency) => void;
  onClear: () => void;
  clearDisabled: boolean;
}

export function MetricsFiltersDrawer({
  open,
  onClose,
  salesmanOptions,
  clientOptions,
  salesmanId,
  clientId,
  closedFilter,
  weeklyVolume,
  useCase,
  industry,
  awarenessChannel,
  seasonality,
  integrationLevel,
  urgency,
  onChangeSalesman,
  onChangeClient,
  onChangeClosed,
  onToggleWeeklyVolume,
  onToggleUseCase,
  onToggleIndustry,
  onToggleAwarenessChannel,
  onToggleSeasonality,
  onToggleIntegrationLevel,
  onToggleUrgency,
  onClear,
  clearDisabled,
}: MetricsFiltersDrawerProps) {
  return (
    <FilterDrawer
      open={open}
      onClose={onClose}
      title="Filtros de metricas"
      footer={
        <div className={styles.footerActions}>
          <Button type="button" variant="outline" onClick={onClear} disabled={clearDisabled}>
            Limpiar filtros
          </Button>
          <Button type="button" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      }
    >
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Generales</h3>
        <div className={styles.field}>
          <label className={styles.label}>Estado de cierre</label>
          <Select
            options={CLOSED_FILTER_OPTIONS}
            value={closedFilter}
            onChange={(value) => onChangeClosed(value as ClosedFilter)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Vendedor</label>
          <Select options={salesmanOptions} value={salesmanId} onChange={onChangeSalesman} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Cliente</label>
          <Select options={clientOptions} value={clientId} onChange={onChangeClient} searchable />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Categorias</h3>
        <CheckboxFilterGroup
          title="Volumen semanal"
          options={WEEKLY_VOLUME_FILTER_OPTIONS}
          selectedValues={weeklyVolume}
          onToggle={(value) => onToggleWeeklyVolume(value as WeeklyVolume)}
        />
        <CheckboxFilterGroup
          title="Caso de uso"
          options={USE_CASE_FILTER_OPTIONS}
          selectedValues={useCase}
          onToggle={(value) => onToggleUseCase(value as UseCase)}
        />
        <CheckboxFilterGroup
          title="Industria"
          options={INDUSTRY_FILTER_OPTIONS}
          selectedValues={industry}
          onToggle={(value) => onToggleIndustry(value as Industry)}
        />
        <CheckboxFilterGroup
          title="Canal de adquisicion"
          options={AWARENESS_CHANNEL_FILTER_OPTIONS}
          selectedValues={awarenessChannel}
          onToggle={(value) => onToggleAwarenessChannel(value as AwarenessChannel)}
        />
        <CheckboxFilterGroup
          title="Estacionalidad"
          options={SEASONALITY_FILTER_OPTIONS}
          selectedValues={seasonality}
          onToggle={(value) => onToggleSeasonality(value as Seasonality)}
        />
        <CheckboxFilterGroup
          title="Dificultad de integracion"
          options={INTEGRATION_LEVEL_FILTER_OPTIONS}
          selectedValues={integrationLevel}
          onToggle={(value) => onToggleIntegrationLevel(value as IntegrationLevel)}
        />
        <CheckboxFilterGroup
          title="Urgencia"
          options={URGENCY_FILTER_OPTIONS}
          selectedValues={urgency}
          onToggle={(value) => onToggleUrgency(value as Urgency)}
        />
      </section>
    </FilterDrawer>
  );
}
