'use client';

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
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
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type SelectOption,
} from '@/ui';
import {
  EMPTY_CATEGORY_FILTERS,
  hasActiveCategoryFilters,
  matchesCategoryFilters,
} from '@/ui/filters';
import { SlidersHorizontal } from 'lucide-react';
import { ClassifyButton } from './classify-button';
import {
  MeetingDetailsModal,
  type MeetingCategoryData,
} from './meeting-details-modal';
import { SalesFiltersDrawer, type ClosedFilter } from './sales-filters-drawer';
import { classifyMeetingAction } from '../_actions/classify-meeting.action';
import styles from './styles/meetings-table.module.css';

interface MeetingRowData {
  id: string;
  date: Date;
  closed: boolean;
  transcription: string;
  client: { id: string; name: string };
  salesman: { id: string; name: string };
  meetingCategory: MeetingCategoryData | null;
}

interface MeetingsTableProps {
  meetings: MeetingRowData[];
  salesmanOptions: SelectOption[];
  clientOptions: SelectOption[];
}

export function MeetingsTable({
  meetings,
  salesmanOptions,
  clientOptions,
}: MeetingsTableProps) {
  const router = useRouter();
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchActiveMeetingId, setBatchActiveMeetingId] = useState<string | null>(null);
  const [optimisticClassifiedIds, setOptimisticClassifiedIds] = useState(
    () => new Set<string>()
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [salesmanId, setSalesmanId] = useState<string>('all');
  const [clientId, setClientId] = useState<string>('all');
  const [closedFilter, setClosedFilter] = useState<ClosedFilter>('all');
  const [onlyPending, setOnlyPending] = useState(false);
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
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRowData | null>(null);

  const toggleValue = <T extends string>(setter: Dispatch<SetStateAction<T[]>>, value: T) => {
    setter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const categoryFilters = {
    weeklyVolume,
    useCase,
    industry,
    awarenessChannel,
    seasonality,
    integrationLevel,
    urgency,
  };

  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      if (salesmanId !== 'all' && meeting.salesman.id !== salesmanId) return false;
      if (clientId !== 'all' && meeting.client.id !== clientId) return false;
      if (closedFilter === 'closed' && !meeting.closed) return false;
      if (closedFilter === 'open' && meeting.closed) return false;
      if (onlyPending && meeting.meetingCategory) return false;
      if (!matchesCategoryFilters(meeting.meetingCategory, categoryFilters)) return false;
      return true;
    });
  }, [
    meetings,
    salesmanId,
    clientId,
    closedFilter,
    onlyPending,
    weeklyVolume,
    useCase,
    industry,
    awarenessChannel,
    seasonality,
    integrationLevel,
    urgency,
  ]);

  useEffect(() => {
    setOptimisticClassifiedIds((prev) => {
      if (prev.size === 0) return prev;
      const next = new Set(prev);
      let changed = false;
      for (const id of prev) {
        if (meetings.some((m) => m.id === id && m.meetingCategory)) {
          next.delete(id);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [meetings]);

  const pendingInView = useMemo(
    () =>
      filteredMeetings.filter(
        (m) => m.meetingCategory === null && !optimisticClassifiedIds.has(m.id)
      ),
    [filteredMeetings, optimisticClassifiedIds]
  );

  const salesmanSelectOptions = useMemo<SelectOption[]>(
    () => [{ value: 'all', label: 'Todos los vendedores' }, ...salesmanOptions],
    [salesmanOptions]
  );

  const clientSelectOptions = useMemo<SelectOption[]>(
    () => [{ value: 'all', label: 'Todos los clientes' }, ...clientOptions],
    [clientOptions]
  );

  const filtersAreDefault =
    salesmanId === 'all' &&
    clientId === 'all' &&
    closedFilter === 'all' &&
    !onlyPending &&
    !hasActiveCategoryFilters(categoryFilters);

  const clearFilters = () => {
    setSalesmanId('all');
    setClientId('all');
    setClosedFilter('all');
    setOnlyPending(false);
    setWeeklyVolume([]);
    setUseCase([]);
    setIndustry([]);
    setAwarenessChannel([]);
    setSeasonality([]);
    setIntegrationLevel([]);
    setUrgency([]);
  };

  const activeFiltersCount =
    (salesmanId !== 'all' ? 1 : 0) +
    (clientId !== 'all' ? 1 : 0) +
    (closedFilter !== 'all' ? 1 : 0) +
    (onlyPending ? 1 : 0) +
    weeklyVolume.length +
    useCase.length +
    industry.length +
    awarenessChannel.length +
    seasonality.length +
    integrationLevel.length +
    urgency.length;

  const handleClassifyPendingBatch = async () => {
    if (pendingInView.length === 0) return;
    setBatchRunning(true);
    try {
      for (const m of pendingInView) {
        setBatchActiveMeetingId(m.id);
        try {
          const result = await classifyMeetingAction(m.id);
          if (result.ok) {
            setOptimisticClassifiedIds((prev) => new Set(prev).add(m.id));
          } else {
            console.error(result.error);
          }
        } catch (error) {
          console.error(error);
        }
        router.refresh();
      }
    } finally {
      setBatchActiveMeetingId(null);
      setBatchRunning(false);
      router.refresh();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <p className={styles.resultsCount}>
          Resultados: <strong>{filteredMeetings.length}</strong> de {meetings.length}
        </p>
        <div className={styles.topBarActions}>
          <Button
            type="button"
            disabled={pendingInView.length === 0 || batchRunning}
            onClick={handleClassifyPendingBatch}
          >
            {batchRunning
              ? 'Clasificando...'
              : `Clasificar pendientes (${pendingInView.length})`}
          </Button>
          <Button type="button" variant="outline" onClick={() => setDrawerOpen(true)}>
            <SlidersHorizontal size={16} />
            Filtrar {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
          </Button>
        </div>
      </div>

      <div className={styles.tableShell}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={styles.colClient}>Cliente</TableHead>
              <TableHead className={styles.colSalesman}>Vendedor</TableHead>
              <TableHead className={styles.colDate}>Fecha</TableHead>
              <TableHead className={styles.colVenta}>Venta</TableHead>
              <TableHead className={styles.colCategories}>Categorías</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMeetings.map((meeting) => {
              const category = meeting.meetingCategory;
              const showAsClassified =
                category != null || optimisticClassifiedIds.has(meeting.id);

              return (
                <TableRow key={meeting.id}>
                  <TableCell
                    className={`${styles.clipText} ${styles.colClient}`}
                    title={meeting.client.name}
                  >
                    {meeting.client.name}
                  </TableCell>
                  <TableCell
                    className={`${styles.clipText} ${styles.colSalesman}`}
                    title={meeting.salesman.name}
                  >
                    {meeting.salesman.name}
                  </TableCell>
                  <TableCell className={styles.colDate}>
                    {new Date(meeting.date).toLocaleDateString('es-CL')}
                  </TableCell>
                  <TableCell className={styles.colVenta}>
                    <Badge variant={meeting.closed ? 'success' : 'warning'}>
                      {meeting.closed ? 'Cerrada' : 'Abierta'}
                    </Badge>
                  </TableCell>
                  <TableCell className={styles.colCategories}>
                    {showAsClassified ? (
                      <div className={styles.categoryActions}>
                        <button
                          type="button"
                          className={styles.detailsButton}
                          onClick={() => setSelectedMeeting(meeting)}
                        >
                          Mostrar detalles
                        </button>
                        <Badge variant="success">Clasificada</Badge>
                      </div>
                    ) : (
                      <div className={styles.categoryActions}>
                        <button
                          type="button"
                          className={styles.detailsButton}
                          onClick={() => setSelectedMeeting(meeting)}
                        >
                          Mostrar detalles
                        </button>
                        <ClassifyButton
                          salesMeetingId={meeting.id}
                          batchActiveMeetingId={batchActiveMeetingId}
                          isBatchRunning={batchRunning}
                        />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}

            {filteredMeetings.length === 0 && (
              <TableRow>
                <TableCell className={styles.emptyRow} colSpan={5}>
                  No hay reuniones que coincidan con los filtros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <SalesFiltersDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        salesmanOptions={salesmanSelectOptions}
        clientOptions={clientSelectOptions}
        salesmanId={salesmanId}
        clientId={clientId}
        closedFilter={closedFilter}
        onlyPending={onlyPending}
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
        onChangeOnlyPending={setOnlyPending}
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

      {selectedMeeting && (
        <MeetingDetailsModal
          meeting={{
            date: selectedMeeting.date,
            closed: selectedMeeting.closed,
            transcription: selectedMeeting.transcription,
            client: { name: selectedMeeting.client.name },
            salesman: { name: selectedMeeting.salesman.name },
            meetingCategory: selectedMeeting.meetingCategory,
          }}
          onClose={() => setSelectedMeeting(null)}
        />
      )}
    </div>
  );
}
