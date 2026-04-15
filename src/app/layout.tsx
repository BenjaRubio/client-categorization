import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import styles from "../styles/layout.module.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Client Categorization",
  description: "Advanced client categorization platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <nav className={`glass ${styles.nav}`}>
          <div className="text-xl font-bold gradient-text">ClientCat</div>
          <div className={styles.navLinks}>
            <a href="/" className={styles.navLink}>Home</a>
            <a href="/dashboard" className={styles.navLink}>Dashboard</a>
          </div>
        </nav>
        <main className={styles.main}>
          {children}
        </main>
      </body>
    </html>
  );
}
