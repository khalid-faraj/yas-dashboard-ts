import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import {
  formatRangeForApi,
  formatRangeForInputs,
  getCurrentMonthRange,
  getLastWeekRange,
  getTodayRange,
  getYesterdayRange,
} from '../../utils/collectionsDateRanges';

import styles from './CollectionsDateFilter.module.css';
import type {
  CollectionsDateFilterMode,
  CollectionsSubmittedQuery,
  EmployeeOption,
  ResolvedDateTimeRange,
} from '../../types/employeeCollections';

export interface CollectionsDateFilterProps {
  employees: EmployeeOption[];
  employeesLoading: boolean;
  onSubmit: (query: CollectionsSubmittedQuery) => void;
  isLoading: boolean;
}

interface ModeOption {
  value: CollectionsDateFilterMode;
  label: string;
}

// Order chosen so that, in RTL, "اليوم" renders rightmost/first and
// "مخصص" renders last/leftmost — matching the requested tab order (اليوم
// and أمس added ahead of the existing آخر أسبوع / الشهر الحالي / مخصص).
const MODES: ModeOption[] = [
  { value: 'today', label: 'اليوم' },
  { value: 'yesterday', label: 'أمس' },
  { value: 'lastWeek', label: 'آخر أسبوع' },
  { value: 'currentMonth', label: 'الشهر الحالي' },
  { value: 'custom', label: 'مخصص' },
];

const ALL_EMPLOYEES_VALUE = '';

export default function CollectionsDateFilter({
  employees,
  employeesLoading,
  onSubmit,
  isLoading,
}: CollectionsDateFilterProps): JSX.Element {
  const [mode, setMode] = useState<CollectionsDateFilterMode>('today');
  const [fromDateTime, setFromDateTime] = useState<string>('');
  const [toDateTime, setToDateTime] = useState<string>('');
  const [employeePk, setEmployeePk] = useState<number | undefined>(undefined);

  // The last resolved boundary actually sent to the API — the source of
  // truth used to re-submit when only the employee filter changes.
  const [currentRange, setCurrentRange] = useState<ResolvedDateTimeRange | null>(
    null
  );

  function submit(range: ResolvedDateTimeRange, pk: number | undefined): void {
    setCurrentRange(range);
    const api = formatRangeForApi(range);
    onSubmit({ fromDate: api.fromDate, toDate: api.toDate, employeePk: pk });
  }

  function selectPreset(
    newMode: CollectionsDateFilterMode,
    resolve: () => ResolvedDateTimeRange
  ): void {
    const range = resolve();
    const inputs = formatRangeForInputs(range);

    setFromDateTime(inputs.fromDateTime);
    setToDateTime(inputs.toDateTime);
    setMode(newMode);
    submit(range, employeePk);
  }

  // Auto-load today's data on first mount.
  useEffect(() => {
    selectPreset('today', getTodayRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleModeClick(value: CollectionsDateFilterMode): void {
    if (value === 'today') selectPreset('today', getTodayRange);
    else if (value === 'yesterday') selectPreset('yesterday', getYesterdayRange);
    else if (value === 'lastWeek') selectPreset('lastWeek', getLastWeekRange);
    else if (value === 'currentMonth') selectPreset('currentMonth', getCurrentMonthRange);
    else activateCustom();
  }

  function activateCustom(): void {
    setMode('custom');
    setFromDateTime('');
    setToDateTime('');
  }

  function handleFromDateTimeChange(e: ChangeEvent<HTMLInputElement>): void {
    setFromDateTime(e.target.value);
  }

  function handleToDateTimeChange(e: ChangeEvent<HTMLInputElement>): void {
    setToDateTime(e.target.value);
  }

  function handleCustomSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    if (!fromDateTime || !toDateTime || fromDateTime > toDateTime) {
      return;
    }

    submit(
      { from: new Date(fromDateTime), to: new Date(toDateTime) },
      employeePk
    );
  }

  function handleEmployeeChange(e: ChangeEvent<HTMLSelectElement>): void {
    const value = e.target.value;
    const pk = value === ALL_EMPLOYEES_VALUE ? undefined : Number(value);

    setEmployeePk(pk);

    // Re-run the currently active range with the new employee filter —
    // no need to wait for another date submission.
    if (currentRange) {
      submit(currentRange, pk);
    }
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
          <span className={styles.fieldLabel}>من تاريخ ووقت</span>
          <input
            type="datetime-local"
            className={styles.input}
            value={fromDateTime}
            max={toDateTime || undefined}
            onChange={handleFromDateTimeChange}
            disabled={!isCustom || isLoading}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>إلى تاريخ ووقت</span>
          <input
            type="datetime-local"
            className={styles.input}
            value={toDateTime}
            min={fromDateTime || undefined}
            onChange={handleToDateTimeChange}
            disabled={!isCustom || isLoading}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>البائع</span>
          <select
            className={styles.select}
            value={employeePk ?? ALL_EMPLOYEES_VALUE}
            onChange={handleEmployeeChange}
            disabled={isLoading || employeesLoading}
          >
            <option value={ALL_EMPLOYEES_VALUE}>كل البائعين</option>
            {employees.map((employee) => (
              <option key={employee.pk} value={employee.pk}>
                {employee.name}
              </option>
            ))}
          </select>
        </label>

        {isCustom && (
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading || !fromDateTime || !toDateTime || fromDateTime > toDateTime}
          >
            {isLoading ? 'جارٍ التحميل...' : 'عرض التقرير'}
          </button>
        )}
      </form>
    </div>
  );
}
