import React from 'react';
import styles from './styles/table.module.css';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table = ({ children, className = '' }: TableProps) => (
  <div className={`${styles.wrapper} ${className}`}>
    <table className={styles.table}>{children}</table>
  </div>
);

export const TableHeader = ({ children, className = '' }: TableProps) => (
  <thead className={`${styles.header} ${className}`}>{children}</thead>
);

export const TableBody = ({ children, className = '' }: TableProps) => (
  <tbody className={className}>{children}</tbody>
);

export const TableRow = ({ children, className = '' }: TableProps) => (
  <tr className={`${styles.row} ${className}`}>{children}</tr>
);

export const TableHead = ({ children, className = '' }: TableProps) => (
  <th className={`${styles.head} ${className}`}>{children}</th>
);

export const TableCell = ({ children, className = '' }: TableProps) => (
  <td className={`${styles.cell} ${className}`}>{children}</td>
);
