'use client';

import { useMemo, useState } from 'react';
import { IntegrationLevel, Urgency } from '@prisma/client';
import { Button, ScatterChart } from '@/ui';
import { INTEGRATION_LEVEL_LABELS, SEASONALITY_LABELS, URGENCY_LABELS, WEEKLY_VOLUME_LABELS } from '@/lib/enum-labels';
import type { MetricsMeetingRow } from './metrics-dashboard';
import styles from './styles/segmentation-matrix.module.css';

interface SegmentationMatrixProps {
  meetings: MetricsMeetingRow[];
}

const INTEGRATION_TO_AXIS: Record<IntegrationLevel, number> = {
  [IntegrationLevel.LOW]: 1,
  [IntegrationLevel.MEDIUM]: 2,
  [IntegrationLevel.HIGH]: 3,
};

const URGENCY_TO_AXIS: Record<Urgency, number> = {
  [Urgency.LOW]: 1,
  [Urgency.MEDIUM]: 2,
  [Urgency.HIGH]: 3,
};
const WEEKLY_VOLUME_TO_SIZE = {
  RANGE_0_100: 90,
  RANGE_101_500: 150,
  RANGE_501_2000: 230,
  RANGE_2000_PLUS: 320,
  UNDEFINED: 50,
} as const;
const SEASONALITY_TO_COLOR = {
  CONSTANT: '#60a5fa',
  SEASONAL: '#f59e0b',
  UNDEFINED: '#94a3b8',
} as const;

/** Alineado con barras de ventas: cerrada = verde, abierta = ámbar */
const CLOSED_STATE_TO_COLOR = {
  closed: '#4ade80',
  open: '#facc15',
} as const;

type ColorMode = 'seasonality' | 'closed';

/** Jitter estable por reunión (evita saltos al cambiar el modo de color). */
function stableJitter(id: string, salt: number): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= salt * 374761393;
  const u = ((h >>> 0) % 10_000) / 10_000;
  return (u - 0.5) * 0.4;
}

function getQuadrantTag(integration: IntegrationLevel, urgency: Urgency) {
  const easy = integration === IntegrationLevel.LOW;
  const urgent = urgency === Urgency.HIGH;
  const not_urgent = urgency === Urgency.LOW;
  if (easy && !not_urgent) return 'Oportunidad - Easy Win';
  if (!easy && urgent) return 'Cuenta estratégica - High Stake';
  return 'No prioritario';
}

export function SegmentationMatrix({ meetings }: SegmentationMatrixProps) {
  const [colorMode, setColorMode] = useState<ColorMode>('seasonality');

  const points = useMemo(() => {
    return meetings
      .filter((meeting) => meeting.meetingCategory !== null)
      .map((meeting) => {
        const category = meeting.meetingCategory!;
        const jx = stableJitter(meeting.id, 0);
        const jy = stableJitter(meeting.id, 1);
        const color =
          colorMode === 'seasonality'
            ? SEASONALITY_TO_COLOR[category.seasonality]
            : meeting.closed
              ? CLOSED_STATE_TO_COLOR.closed
              : CLOSED_STATE_TO_COLOR.open;

        return {
          x: INTEGRATION_TO_AXIS[category.integrationLevel] + jx,
          y: URGENCY_TO_AXIS[category.urgency] + jy,
          z: WEEKLY_VOLUME_TO_SIZE[category.weeklyVolume],
          color,
          label: meeting.client.name,
          clientName: meeting.client.name,
          salesmanName: meeting.salesman.name,
          weeklyVolume: WEEKLY_VOLUME_LABELS[category.weeklyVolume],
          seasonality: SEASONALITY_LABELS[category.seasonality],
          integration: INTEGRATION_LEVEL_LABELS[category.integrationLevel],
          urgency: URGENCY_LABELS[category.urgency],
          quadrant: getQuadrantTag(category.integrationLevel, category.urgency),
          statusLabel: meeting.closed ? 'Cerrada' : 'Abierta',
        };
      });
  }, [meetings, colorMode]);

  if (points.length === 0) {
    return <p>No hay reuniones categorizadas para mostrar en la matriz.</p>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar} role="group" aria-label="Modo de color del gráfico">
        <span className={styles.toolbarLabel}>Color por</span>
        <div className={styles.toggleGroup}>
          <Button
            type="button"
            size="sm"
            variant={colorMode === 'seasonality' ? 'primary' : 'outline'}
            onClick={() => setColorMode('seasonality')}
            className={styles.toggleBtn}
          >
            Estacionalidad
          </Button>
          <Button
            type="button"
            size="sm"
            variant={colorMode === 'closed' ? 'primary' : 'outline'}
            onClick={() => setColorMode('closed')}
            className={styles.toggleBtn}
          >
            Abierta / cerrada
          </Button>
        </div>
      </div>

      <ScatterChart
        data={points}
        height={460}
        xTicks={[1, 2, 3]}
        yTicks={[1, 2, 3]}
        xAxisLabel="Dificultad de integración"
        yAxisLabel="Urgencia"
        xTickFormatter={(value) =>
          value === 1 ? 'Baja' : value === 2 ? 'Media' : 'Alta'
        }
        yTickFormatter={(value) =>
          value === 1 ? 'Baja' : value === 2 ? 'Media' : 'Alta'
        }
        renderTooltip={(point) => (
          <div className={styles.tooltip}>
            <p className={styles.tooltipTitle}>{String(point.clientName)}</p>
            <p className={styles.tooltipBoldLine}>{String(point.quadrant)}</p>
            <p className={styles.tooltipLine}>Vendedor: {String(point.salesmanName)}</p>
            <p className={styles.tooltipLine}>Integración: {String(point.integration)}</p>
            <p className={styles.tooltipLine}>Urgencia: {String(point.urgency)}</p>
            <p className={styles.tooltipLine}>Volumen: {String(point.weeklyVolume)}</p>
            <p className={styles.tooltipLine}>Estacionalidad: {String(point.seasonality)}</p>
            <p className={styles.tooltipLine}>Venta: {String(point.statusLabel)}</p>
          </div>
        )}
      />

      <div className={styles.legend}>
        {colorMode === 'seasonality' ? (
          <>
            <span className={styles.legendTitle}>Estacionalidad</span>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: SEASONALITY_TO_COLOR.CONSTANT }} />
              <span>Constante</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: SEASONALITY_TO_COLOR.SEASONAL }} />
              <span>Estacional</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: SEASONALITY_TO_COLOR.UNDEFINED }} />
              <span>No definido</span>
            </div>
          </>
        ) : (
          <>
            <span className={styles.legendTitle}>Estado de la venta</span>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: CLOSED_STATE_TO_COLOR.closed }} />
              <span>Cerrada</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: CLOSED_STATE_TO_COLOR.open }} />
              <span>Abierta</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
