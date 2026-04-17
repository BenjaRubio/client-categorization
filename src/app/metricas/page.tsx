import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui';
import { getMetricsData } from './_fetchers/get-metrics-data.fetcher';
import { getMainMetrics } from './_fetchers/get-main-metrics.fetcher';
import { MainMetrics } from './_components/main-metrics';
import { MetricsDashboard } from './_components/metrics-dashboard';
import styles from './metricas.module.css';

export default async function MetricasPage() {
  const [meetings, mainMetrics] = await Promise.all([
    getMetricsData(),
    getMainMetrics(),
  ]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Métricas</h1>
        <p className={styles.description}>
          Analiza reuniones, canales, industrias y segmentos de clientes.
        </p>
      </header>

      <MainMetrics data={mainMetrics} />

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Panel de análisis</CardTitle>
          <CardDescription>
            Usa el filtro global para ver solo ventas cerradas, abiertas o todas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MetricsDashboard meetings={meetings} />
        </CardContent>
      </Card>
    </div>
  );
}
