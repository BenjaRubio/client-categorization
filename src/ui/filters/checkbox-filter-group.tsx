import { Checkbox } from '../checkbox';
import type { FilterOption } from './category-filters';
import styles from './styles/checkbox-filter-group.module.css';

interface CheckboxFilterGroupProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}

export function CheckboxFilterGroup({
  title,
  options,
  selectedValues,
  onToggle,
}: CheckboxFilterGroupProps) {
  return (
    <section className={styles.group}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.options}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={() => onToggle(option.value)}
            label={option.label}
          />
        ))}
      </div>
    </section>
  );
}
