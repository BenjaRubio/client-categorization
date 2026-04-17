'use client';

import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Checkbox,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type SelectOption,
} from '@/ui';
import { ClassifyButton } from './classify-button';
import {
  MeetingDetailsModal,
  type MeetingCategoryData,
} from './meeting-details-modal';
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

type ClosedFilter = 'all' | 'closed' | 'open';

const CLOSED_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Todas' },
  { value: 'closed', label: 'Cerradas' },
  { value: 'open', label: 'Abiertas' },
];

export function MeetingsTable({
  meetings,
  salesmanOptions,
  clientOptions,
}: MeetingsTableProps) {
  const [salesmanId, setSalesmanId] = useState<string>('all');
  const [clientId, setClientId] = useState<string>('all');
  const [closedFilter, setClosedFilter] = useState<ClosedFilter>('all');
  const [onlyPending, setOnlyPending] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRowData | null>(null);

  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      if (salesmanId !== 'all' && meeting.salesman.id !== salesmanId) return false;
      if (clientId !== 'all' && meeting.client.id !== clientId) return false;
      if (closedFilter === 'closed' && !meeting.closed) return false;
      if (closedFilter === 'open' && meeting.closed) return false;
      if (onlyPending && meeting.meetingCategory) return false;
      return true;
    });
  }, [meetings, salesmanId, clientId, closedFilter, onlyPending]);

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
    !onlyPending;

  const clearFilters = () => {
    setSalesmanId('all');
    setClientId('all');
    setClosedFilter('all');
    setOnlyPending(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterToolbar}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Vendedor</label>
            <Select
              options={salesmanSelectOptions}
              value={salesmanId}
              onChange={setSalesmanId}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Cliente</label>
            <Select
              options={clientSelectOptions}
              value={clientId}
              onChange={setClientId}
              searchable
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Estado de cierre</label>
            <Select
              options={CLOSED_OPTIONS}
              value={closedFilter}
              onChange={(value) => setClosedFilter(value as ClosedFilter)}
            />
          </div>

          <Checkbox
            checked={onlyPending}
            onChange={setOnlyPending}
            label="Solo pendientes"
            className={styles.pendingCheckbox}
          />
        </div>

        <div className={styles.filterActions}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearFilters}
            disabled={filtersAreDefault}
          >
            Limpiar filtros
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
                    {category ? (
                      <button
                        type="button"
                        className={styles.detailsButton}
                        onClick={() => setSelectedMeeting(meeting)}
                      >
                        Mostrar detalles
                      </button>
                    ) : (
                      <div className={styles.pendingAction}>
                        <Badge variant="neutral">Pendiente</Badge>
                        <ClassifyButton salesMeetingId={meeting.id} />
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

      {selectedMeeting && selectedMeeting.meetingCategory && (
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
