// Reusable, Arabic-friendly formatting utilities.
// Centralized here so no component reimplements formatting logic.

const CURRENCY_SUFFIX = 'ج.م'; // Arabic-friendly currency suffix for Egyptian Pounds (EGP)

export interface FormatCurrencyOptions {
  compact?: boolean;
  decimals?: number;
}

export function formatCurrency(
  value: number,
  options: FormatCurrencyOptions = {}
): string {
  const { compact = true, decimals } = options;
  const num = Number.isFinite(value) ? value : 0;
  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num);

  if (compact && abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(decimals ?? 2)}M ${CURRENCY_SUFFIX}`;
  }
  if (compact && abs >= 1_000) {
    return `${sign}${(abs / 1_000).toFixed(decimals ?? 1)}K ${CURRENCY_SUFFIX}`;
  }

  return `${sign}${abs.toLocaleString('en-US', {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 2,
  })} ${CURRENCY_SUFFIX}`;
}

/**
 * Formats a full (non-compact) currency value, useful for tooltips.
 */
export function formatCurrencyFull(value: number): string {
  const num = Number.isFinite(value) ? value : 0;
  return `${num.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${CURRENCY_SUFFIX}`;
}

/**
 * Formats a plain integer/decimal number with thousands separators.
 */
export function formatNumber(value: number, decimals = 0): string {
  const num = Number.isFinite(value) ? value : 0;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export interface FormatPercentageOptions {
  isRatio?: boolean;
  decimals?: number;
}

/**
 * Formats a ratio (0-1) or a raw percentage number as a percentage string.
 */
export function formatPercentage(
  value: number,
  options: FormatPercentageOptions = {}
): string {
  const { isRatio = true, decimals = 1 } = options;
  const num = Number.isFinite(value) ? value : 0;
  const pct = isRatio ? num * 100 : num;
  return `${pct.toFixed(decimals)}%`;
}

export interface FormatDateOptions {
  withTime?: boolean;
}

/**
 * Formats a date string/Date into a readable Arabic-locale-friendly format.
 */
export function formatDate(
  date: string | Date | null | undefined,
  options: FormatDateOptions = {}
): string {
  const { withTime = false } = options;
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '—';

  const datePart = d.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  if (!withTime) return datePart;

  const timePart = d.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${datePart} ${timePart}`;
}

/**
 * Converts a Date object to a YYYY-MM-DD string (API-safe, non-localized).
 */
export function toApiDateString(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
