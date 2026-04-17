import { Card, CardContent, CardHeader, CardTitle } from '@/ui';
import styles from './styles/main-metrics.module.css';

export interface MainMetricsData {
  totalClients: number;
  totalMeetings: number;
  categorizedMeetings: number;
  closedMeetings: number;
  closedPercent: number;
}

interface MainMetricsProps {
  data: MainMetricsData;
}

function formatInt(n: number) {
  return n.toLocaleString('es-CL');
}

export function MainMetrics({ data }: MainMetricsProps) {
  const {
    totalClients,
    totalMeetings,
    categorizedMeetings,
    closedMeetings,
    closedPercent,
  } = data;

  return (
    <div className={styles.grid}>
      <Card variant="glass">
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>Clientes totales</CardTitle>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          <div className={styles.value}>{formatInt(totalClients)}</div>
        </CardContent>
      </Card>

      <Card variant="glass">
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>Reuniones de venta totales</CardTitle>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          <div className={styles.value}>{formatInt(totalMeetings)}</div>
        </CardContent>
      </Card>

      <Card variant="glass">
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>Reuniones de venta categorizadas</CardTitle>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          <div className={styles.value}>{formatInt(categorizedMeetings)}</div>
        </CardContent>
      </Card>

      <Card variant="glass">
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>Ventas cerradas</CardTitle>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          <div className={styles.value}>{formatInt(closedMeetings)}</div>
          <p className={styles.sub}>
            {totalMeetings > 0
              ? `${closedPercent.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}% sobre el total de reuniones`
              : 'Sin reuniones registradas'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
