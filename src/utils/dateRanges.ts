import type {
  DateRangeInput,
  MonthRangeInput,
  QuickRangeOption,
  ResolvedDateRange,
} from '../types/sales';

function startOfDay(d: Date): Date {
  const x = new Date(d);

  x.setHours(0, 0, 0, 0);

  return x;
}

function endOfDay(d: Date): Date {
  const x = new Date(d);

  x.setHours(23, 59, 59, 999);

  return x;
}

function addDays(d: Date, days: number): Date {
  const x = new Date(d);

  x.setDate(x.getDate() + days);

  return x;
}

/**
 * Converts Date to datetime-local format.
 *
 * Example:
 * 2026-08-17T12:30
 */
function toDateTimeLocalString(date: Date): string {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');

  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Converts Date to API-ready format.
 *
 * Example:
 * 2026-08-17T12:30:00
 */
function toApiDateString(date: Date): string {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');

  const minutes = String(date.getMinutes()).padStart(2, '0');

  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

/**
 * Quick date ranges.
 */
export function getQuickRanges(): QuickRangeOption[] {
  const now = new Date();

  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const startOfThisMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
    0,
    0,
    0,
    0
  );

  const startOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1,
    0,
    0,
    0,
    0
  );

  const endOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59,
    999
  );

  return [
    {
      key: 'today',
      label: 'اليوم',

      resolve: () => ({
        from: todayStart,
        to: todayEnd,
      }),
    },

    {
      key: 'yesterday',
      label: 'أمس',

      resolve: () => {
        const yesterday = addDays(todayStart, -1);

        return {
          from: startOfDay(yesterday),
          to: endOfDay(yesterday),
        };
      },
    },

    {
      key: 'last7',
      label: 'آخر 7 أيام',

      resolve: () => ({
        from: startOfDay(addDays(todayStart, -6)),
        to: todayEnd,
      }),
    },

    {
      key: 'last30',
      label: 'آخر 30 يوم',

      resolve: () => ({
        from: startOfDay(addDays(todayStart, -29)),
        to: todayEnd,
      }),
    },

    {
      key: 'thisMonth',
      label: 'هذا الشهر',

      resolve: () => ({
        from: startOfThisMonth,
        to: todayEnd,
      }),
    },

    {
      key: 'lastMonth',
      label: 'الشهر الماضي',

      resolve: () => ({
        from: startOfLastMonth,
        to: endOfLastMonth,
      }),
    },
  ];
}

/**
 * Converts Date range to datetime-local strings.
 */
export function formatRangeAsStrings({
  from,
  to,
}: ResolvedDateRange): DateRangeInput {
  return {
    dateFrom: toDateTimeLocalString(from),
    dateTo: toDateTimeLocalString(to),
  };
}

/**
 * Converts Date range to API strings.
 */
export function formatRangeForApi({
  from,
  to,
}: ResolvedDateRange): DateRangeInput {
  return {
    dateFrom: toApiDateString(from),
    dateTo: toApiDateString(to),
  };
}

/**
 * Arabic month options.
 */
export const MONTH_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: 'يناير' },
  { value: 2, label: 'فبراير' },
  { value: 3, label: 'مارس' },
  { value: 4, label: 'أبريل' },
  { value: 5, label: 'مايو' },
  { value: 6, label: 'يونيو' },
  { value: 7, label: 'يوليو' },
  { value: 8, label: 'أغسطس' },
  { value: 9, label: 'سبتمبر' },
  { value: 10, label: 'أكتوبر' },
  { value: 11, label: 'نوفمبر' },
  { value: 12, label: 'ديسمبر' },
];

/**
 * Resolves month range.
 */
export function resolveMonthRange({
  fromMonth,
  toMonth,
  year,
}: MonthRangeInput): DateRangeInput {
  let start = Number(fromMonth);
  let end = Number(toMonth);
  const selectedYear = Number(year);

  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    !Number.isInteger(selectedYear)
  ) {
    throw new Error('Invalid month range');
  }

  if (start < 1 || start > 12 || end < 1 || end > 12) {
    throw new Error('Month must be between 1 and 12');
  }

  if (start > end) {
    [start, end] = [end, start];
  }

  const from = new Date(selectedYear, start - 1, 1, 0, 0, 0, 0);

  const to = new Date(selectedYear, end, 0, 23, 59, 59, 999);

  return {
    dateFrom: toApiDateString(from),
    dateTo: toApiDateString(to),
  };
}
