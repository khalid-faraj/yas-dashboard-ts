import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import styles from './MonthRangeFilter.module.css';
import type { DateRangeInput } from '../../types/sales';

export interface MonthRangeFilterProps {
  onSubmit: (range: DateRangeInput) => void;
  isLoading: boolean;
}

function formatDateTimeLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function MonthRangeFilter({
  onSubmit,
  isLoading,
}: MonthRangeFilterProps): JSX.Element {
  const now = new Date();

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 0);

  const [dateFrom, setDateFrom] = useState<string>(
    formatDateTimeLocal(startOfDay)
  );

  const [dateTo, setDateTo] = useState<string>(formatDateTimeLocal(endOfDay));

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    if (!dateFrom || !dateTo) {
      return;
    }

    if (new Date(dateFrom) > new Date(dateTo)) {
      alert('تاريخ البداية يجب أن يكون قبل تاريخ النهاية');
      return;
    }

    console.log('DATE TIME RANGE:', {
      dateFrom,
      dateTo,
    });

    onSubmit({
      dateFrom,
      dateTo,
    });
  }

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>من تاريخ ووقت</span>

        <input
          type="datetime-local"
          className={styles.select}
          value={dateFrom}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setDateFrom(e.target.value)
          }
          disabled={isLoading}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>إلى تاريخ ووقت</span>

        <input
          type="datetime-local"
          className={styles.select}
          value={dateTo}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setDateTo(e.target.value)
          }
          disabled={isLoading}
        />
      </label>

      <button type="submit" className={styles.submitBtn} disabled={isLoading}>
        {isLoading ? 'جارٍ التحميل...' : 'عرض التقرير'}
      </button>
    </form>
  );
}
