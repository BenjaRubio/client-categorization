import React from 'react';
import styles from './styles/table.module.css';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
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

export const TableRow = ({ children, className = '', ...props }: TableRowProps) => (
  <tr className={`${styles.row} ${className}`} {...props}>
    {children}
  </tr>
);

export const TableHead = ({ children, className = '', ...props }: TableHeadProps) => (
  <th className={`${styles.head} ${className}`} {...props}>
    {children}
  </th>
);

export const TableCell = ({ children, className = '', ...props }: TableCellProps) => (
  <td className={`${styles.cell} ${className}`} {...props}>
    {children}
  </td>
);
