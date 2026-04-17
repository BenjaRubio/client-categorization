'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './styles/select.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  className?: string;
}

export const Select = ({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  searchable = false,
  className = '',
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open, searchable]);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  const filtered = searchable && search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div ref={containerRef} className={`${styles.container} ${className}`}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(!open)}
      >
        <span className={selectedLabel ? undefined : styles.placeholder}>
          {selectedLabel || placeholder}
        </span>
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className={styles.dropdown}>
          {searchable && (
            <input
              ref={searchRef}
              type="text"
              className={styles.searchInput}
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
          {filtered.length === 0 ? (
            <div className={styles.empty}>Sin resultados</div>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`${styles.option} ${opt.value === value ? styles.optionSelected : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setSearch('');
                }}
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
