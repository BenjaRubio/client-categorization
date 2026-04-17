import React from 'react';
import styles from './styles/checkbox.module.css';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export const Checkbox = ({ checked, onChange, label, className = '' }: CheckboxProps) => (
  <label className={`${styles.label} ${className}`}>
    <input
      type="checkbox"
      className={styles.input}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    {label && <span>{label}</span>}
  </label>
);
