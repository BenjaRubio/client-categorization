import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Dashboard de <span className="gradient-text">reuniones comerciales</span> e información de ventas
        </h1>
        <p className={styles.subtitle}>
          Analiza la información de ventas, clientes, clasifícalos y estudia las métricas de manera sencilla.
        </p>
        <div className={styles.actions}>
          <Link href="/ventas" className={`${styles.actionLink} ${styles.actionPrimary}`}>
            Ir a ventas <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/metricas" className={`${styles.actionLink} ${styles.actionOutline}`}>
            Ver metricas
          </Link>
        </div>
      </section>
    </div>
  );
}
