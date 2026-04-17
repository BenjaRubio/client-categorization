import { ScatterChart } from '@/ui';
import { INTEGRATION_LEVEL_LABELS, SEASONALITY_LABELS, URGENCY_LABELS, WEEKLY_VOLUME_LABELS } from '@/lib/enum-labels';
import type { MetricsMeetingRow } from './metrics-dashboard';
import styles from './styles/segmentation-matrix.module.css';

interface SegmentationMatrixProps {
  meetings: MetricsMeetingRow[];
}

const INTEGRATION_TO_AXIS = { LOW: 1, MEDIUM: 2, HIGH: 3 } as const;
const URGENCY_TO_AXIS = { LOW: 1, MEDIUM: 2, HIGH: 3 } as const;
const WEEKLY_VOLUME_TO_SIZE = {
  RANGE_0_100: 90,
  RANGE_101_500: 150,
  RANGE_501_2000: 230,
  RANGE_2000_PLUS: 320,
  UNDEFINED: 70,
} as const;
const SEASONALITY_TO_COLOR = {
  CONSTANT: '#60a5fa',
  SEASONAL: '#f59e0b',
  UNDEFINED: '#94a3b8',
} as const;

function getQuadrantTag(integration: 'LOW' | 'MEDIUM' | 'HIGH', urgency: 'LOW' | 'MEDIUM' | 'HIGH') {
  const hard = integration === 'HIGH';
  const urgent = urgency === 'HIGH';
  if (!hard && urgent) return 'Oportunidad - Easy Win';
  if (hard && urgent) return 'Cuenta estratégica - High Stake';
  return 'No prioritario';
}

export function SegmentationMatrix({ meetings }: SegmentationMatrixProps) {
  const points = meetings
    .filter((meeting) => meeting.meetingCategory !== null)
    .map((meeting) => {
      const category = meeting.meetingCategory!;
      return {
        x: INTEGRATION_TO_AXIS[category.integrationLevel],
        y: URGENCY_TO_AXIS[category.urgency],
        z: WEEKLY_VOLUME_TO_SIZE[category.weeklyVolume],
        color: SEASONALITY_TO_COLOR[category.seasonality],
        label: meeting.client.name,
        clientName: meeting.client.name,
        salesmanName: meeting.salesman.name,
        weeklyVolume: WEEKLY_VOLUME_LABELS[category.weeklyVolume],
        seasonality: SEASONALITY_LABELS[category.seasonality],
        integration: INTEGRATION_LEVEL_LABELS[category.integrationLevel],
        urgency: URGENCY_LABELS[category.urgency],
        quadrant: getQuadrantTag(category.integrationLevel, category.urgency),
      };
    });

  if (points.length === 0) {
    return <p>No hay reuniones categorizadas para mostrar en la matriz.</p>;
  }

  return (
    <div className={styles.wrapper}>
      <ScatterChart
        data={points}
        height={460}
        xTicks={[1, 2, 3]}
        yTicks={[1, 2, 3]}
        xTickFormatter={(value) =>
          value === 1 ? 'Baja' : value === 2 ? 'Media' : 'Alta'
        }
        yTickFormatter={(value) =>
          value === 1 ? 'Baja' : value === 2 ? 'Media' : 'Alta'
        }
        renderTooltip={(point) => (
          <div className={styles.tooltip}>
            <p className={styles.tooltipTitle}>{String(point.clientName)}</p>
            <p className={styles.tooltipLine}>Vendedor: {String(point.salesmanName)}</p>
            <p className={styles.tooltipLine}>Integración: {String(point.integration)}</p>
            <p className={styles.tooltipLine}>Urgencia: {String(point.urgency)}</p>
            <p className={styles.tooltipLine}>Volumen: {String(point.weeklyVolume)}</p>
            <p className={styles.tooltipLine}>Estacionalidad: {String(point.seasonality)}</p>
            <p className={styles.tooltipLine}>Segmento: {String(point.quadrant)}</p>
          </div>
        )}
      />

      <div className={styles.quadrants}>
        <span className={styles.quadrantOne}>No prioritario</span>
        <span className={styles.quadrantTwo}>Oportunidad - Easy Win</span>
        <span className={styles.quadrantThree}>No prioritario</span>
        <span className={styles.quadrantFour}>Cuenta estratégica - High Stake</span>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: '#60a5fa' }} />
          <span>Constante</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: '#f59e0b' }} />
          <span>Estacional</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: '#94a3b8' }} />
          <span>No definido</span>
        </div>
      </div>
    </div>
  );
}
