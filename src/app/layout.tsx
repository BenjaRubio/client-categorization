import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import styles from '../styles/layout.module.css';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Clasificacion de clientes',
  description: 'Plataforma para gestionar reuniones, clasificar clientes y analizar metricas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <nav className={`glass ${styles.nav}`}>
          <Link href="/" className="text-xl font-bold gradient-text">
            ClientCat
          </Link>
          <div className={styles.navLinks}>
            <Link href="/" className={styles.navLink}>
              Inicio
            </Link>
            <Link href="/ventas" className={styles.navLink}>
              Ventas
            </Link>
            <Link href="/metricas" className={styles.navLink}>
              Metricas
            </Link>
          </div>
        </nav>
        <main className={styles.main}>
          {children}
        </main>
      </body>
    </html>
  );
}
