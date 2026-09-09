import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import {
  getCurrentMonthRange,
  getLastWeekRange,
} from '../../utils/collectionsDateRanges';

import styles from './CollectionsDateFilter.module.css';
import type {
  CollectionsDateFilterMode,
  CollectionsDateRange,
} from '../../types/employeeCollections';

export interface CollectionsDateFilterProps {
  onSubmit: (range: CollectionsDateRange) => void;
  isLoading: boolean;
}

interface ModeOption {
  value: CollectionsDateFilterMode;
  label: string;
}

// Order chosen so that, in RTL, "آخر أسبوع" renders rightmost and "مخصص"
// renders last/leftmost — matching the requested tab order.
const MODES: ModeOption[] = [
  { value: 'lastWeek', label: 'آخر أسبوع' },
  { value: 'currentMonth', label: 'الشهر الحالي' },
  { value: 'custom', label: 'مخصص' },
];

export default function CollectionsDateFilter({
  onSubmit,
  isLoading,
}: CollectionsDateFilterProps): JSX.Element {
  const initialRange = useMemo(() => getCurrentMonthRange(), []);

  const [mode, setMode] = useState<CollectionsDateFilterMode>('currentMonth');
  const [fromDate, setFromDate] = useState<string>(initialRange.fromDate);
  const [toDate, setToDate] = useState<string>(initialRange.toDate);

  // Auto-load the default range (current month) on first mount.
  useEffect(() => {
    onSubmit({ fromDate: initialRange.fromDate, toDate: initialRange.toDate });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectLastWeek(): void {
    const range = getLastWeekRange();
    setFromDate(range.fromDate);
    setToDate(range.toDate);
    setMode('lastWeek');
    onSubmit(range);
  }

  function selectCurrentMonth(): void {
    const range = getCurrentMonthRange();
    setFromDate(range.fromDate);
    setToDate(range.toDate);
    setMode('currentMonth');
    onSubmit(range);
  }

  function activateCustom(): void {
    setMode('custom');
    setFromDate('');
    setToDate('');
  }

  function handleModeClick(value: CollectionsDateFilterMode): void {
    if (value === 'lastWeek') selectLastWeek();
    else if (value === 'currentMonth') selectCurrentMonth();
    else activateCustom();
  }

  function handleFromDateChange(e: ChangeEvent<HTMLInputElement>): void {
    setFromDate(e.target.value);
  }

  function handleToDateChange(e: ChangeEvent<HTMLInputElement>): void {
    setToDate(e.target.value);
  }

  function handleCustomSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    if (!fromDate || !toDate || fromDate > toDate) {
      return;
    }

    onSubmit({ fromDate, toDate });
  }

  const isCustom = mode === 'custom';

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabsRow}>
        {MODES.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`${styles.tab} ${mode === option.value ? styles.tabActive : ''}`}
            onClick={() => handleModeClick(option.value)}
            disabled={isLoading}
          >
            {option.label}
          </button>
        ))}
      </div>

      <form className={styles.formRow} onSubmit={handleCustomSubmit}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>من تاريخ</span>
          <input
            type="date"
            className={styles.input}
            value={fromDate}
            max={toDate || undefined}
            onChange={handleFromDateChange}
            disabled={!isCustom || isLoading}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>إلى تاريخ</span>
          <input
            type="date"
            className={styles.input}
            value={toDate}
            min={fromDate || undefined}
            onChange={handleToDateChange}
            disabled={!isCustom || isLoading}
          />
        </label>

        {isCustom && (
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading || !fromDate || !toDate || fromDate > toDate}
          >
            {isLoading ? 'جارٍ التحميل...' : 'عرض التقرير'}
          </button>
        )}
      </form>
    </div>
  );
}
