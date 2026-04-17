import React from 'react';
import styles from './styles/badge.module.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'destructive' | 'info';
  className?: string;
}

export const Badge = ({ children, variant = 'neutral', className = '' }: BadgeProps) => (
  <span className={`${styles.badge} ${styles[variant]} ${className}`}>
    {children}
  </span>
);
