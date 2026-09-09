import { useMemo, useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import { getQuickRanges, formatRangeAsStrings } from '../../utils/dateRanges';

import styles from './DateRangeFilter.module.css';
import type { DateRangeInput, QuickRangeOption } from '../../types/sales';

export interface DateRangeFilterProps {
  onSubmit: (range: DateRangeInput) => void;
  isLoading: boolean;
}

type ActivePreset =
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'last30'
  | 'thisMonth'
  | 'lastMonth'
  | 'custom';

/**
 * Returns today's complete range.
 *
 * From: today 00:00
 * To:   today 23:59
 */
function getTodayRange(): DateRangeInput {
  const now = new Date();

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return formatRangeAsStrings({
    from: start,
    to: end,
  });
}

/**
 * Controlled date/time range filter.
 *
 * On first load:
 * - Selects today's complete day.
 * - Automatically loads today's sales.
 *
 * After that:
 * - User can use quick presets.
 * - User can select "مخصص".
 * - User can change date/time manually.
 * - User can press "عرض التقرير".
 */
export default function DateRangeFilter({
  onSubmit,
  isLoading,
}: DateRangeFilterProps): JSX.Element {
  /**
   * Today's initial range.
   */
  const initialRange = useMemo(() => getTodayRange(), []);

  /**
   * Selected start date/time.
   */
  const [dateFrom, setDateFrom] = useState<string>(initialRange.dateFrom);

  /**
   * Selected end date/time.
   */
  const [dateTo, setDateTo] = useState<string>(initialRange.dateTo);

  /**
   * Currently active preset.
   *
   * Possible values:
   * today
   * yesterday
   * last7
   * last30
   * thisMonth
   * lastMonth
   * custom
   */
  const [activePreset, setActivePreset] = useState<ActivePreset>('today');

  /**
   * Quick presets.
   */
  const quickRanges = useMemo(() => getQuickRanges(), []);

  /**
   * Automatically load today's sales
   * when the Dashboard is opened.
   */
  useEffect(() => {
    onSubmit({
      dateFrom: initialRange.dateFrom,
      dateTo: initialRange.dateTo,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRange, onSubmit]);

  /**
   * Apply one of the predefined date ranges.
   *
   * Examples:
   * - اليوم
   * - أمس
   * - آخر 7 أيام
   * - آخر 30 يوم
   * - هذا الشهر
   * - الشهر الماضي
   */
  function applyPreset(preset: QuickRangeOption): void {
    if (!preset?.resolve) {
      return;
    }

    const { from, to } = preset.resolve();

    const { dateFrom: formattedFrom, dateTo: formattedTo } =
      formatRangeAsStrings({ from, to });

    setDateFrom(formattedFrom);
    setDateTo(formattedTo);
    setActivePreset(preset.key as ActivePreset);

    /**
     * Quick presets submit immediately.
     */
    onSubmit({
      dateFrom: formattedFrom,
      dateTo: formattedTo,
    });
  }

  /**
   * Activate custom mode.
   *
   * Important:
   * This does NOT submit the report.
   * It only activates the custom selection.
   */
  function activateCustom(): void {
    setActivePreset('custom');
    setDateFrom('');
    setDateTo('');
  }

  /**
   * Handle manual start date/time change.
   */
  function handleDateFromChange(e: ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value;

    setDateFrom(value);
    setActivePreset('custom');
  }

  /**
   * Handle manual end date/time change.
   */
  function handleDateToChange(e: ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value;

    setDateTo(value);
    setActivePreset('custom');
  }

  /**
   * Submit custom date/time range.
   */
  function handleCustomSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    /**
     * Don't submit incomplete ranges.
     */
    if (!dateFrom || !dateTo) {
      return;
    }

    /**
     * Don't allow:
     *
     * From > To
     */
    if (dateFrom > dateTo) {
      return;
    }

    setActivePreset('custom');

    onSubmit({
      dateFrom,
      dateTo,
    });
  }

  return (
    <div className={styles.wrapper}>
      {/* =========================
          Quick Ranges
      ========================== */}
      <div className={styles.quickRow}>
        {quickRanges.map((preset) => (
          <button
            key={preset.key}
            type="button"
            className={`${styles.presetBtn} ${
              activePreset === preset.key ? styles.presetBtnActive : ''
            }`}
            onClick={() => applyPreset(preset)}
            disabled={isLoading}
          >
            {preset.label}
          </button>
        ))}

        {/* =========================
            Custom Button
        ========================== */}
        <button
          type="button"
          className={`${styles.presetBtn} ${
            activePreset === 'custom' ? styles.presetBtnActive : ''
          }`}
          onClick={activateCustom}
          disabled={isLoading}
        >
          مخصص
        </button>
      </div>

      {/* =========================
          Date & Time Form
      ========================== */}
      <form className={styles.formRow} onSubmit={handleCustomSubmit}>
        {/* =========================
            From Date
        ========================== */}
        <label className={styles.field}>
          <span className={styles.fieldLabel}>من تاريخ ووقت</span>

          <input
            type="datetime-local"
            className={styles.input}
            value={dateFrom}
            max={dateTo || undefined}
            onChange={handleDateFromChange}
            disabled={isLoading}
          />
        </label>

        {/* =========================
            To Date
        ========================== */}
        <label className={styles.field}>
          <span className={styles.fieldLabel}>إلى تاريخ ووقت</span>

          <input
            type="datetime-local"
            className={styles.input}
            value={dateTo}
            min={dateFrom || undefined}
            onChange={handleDateToChange}
            disabled={isLoading}
          />
        </label>

        {/* =========================
            Submit
        ========================== */}
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isLoading || !dateFrom || !dateTo || dateFrom > dateTo}
        >
          {isLoading ? 'جارٍ التحميل...' : 'عرض التقرير'}
        </button>
      </form>
    </div>
  );
}
