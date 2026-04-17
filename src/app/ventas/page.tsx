import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui';
import { getMeetings } from './_fetchers/get-meetings.fetcher';
import { getFilterOptions } from './_fetchers/get-filter-options.fetcher';
import { MeetingsTable } from './_components/meetings-table';
import styles from './ventas.module.css';

export default async function VentasPage() {
  const [meetings, filterOptions] = await Promise.all([
    getMeetings(),
    getFilterOptions(),
  ]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Ventas</h1>
        <p className={styles.description}>
          Revisa reuniones, aplica filtros y clasifica las pendientes.
        </p>
      </header>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Reuniones de ventas</CardTitle>
          <CardDescription>
            Filtra por vendedor, estado de cierre, cliente o cualquier categoría.
            Las reuniones sin categoría pueden clasificarse manualmente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MeetingsTable
            meetings={meetings}
            salesmanOptions={filterOptions.salesmen}
            clientOptions={filterOptions.clients}
          />
        </CardContent>
      </Card>
    </div>
  );
}
