import type { DashboardAnalytics } from './analytics';
import type { SalesRecord, ApiError } from './api';

/** Internal status machine used by `useSalesReport`. */
export type ReportStatus = 'idle' | 'loading' | 'success' | 'error';

/** The `{ dateFrom, dateTo }` shape passed around by filters and the hook. */
export interface DateRangeInput {
  dateFrom: string;
  dateTo: string;
}

/** A resolved `Date` pair, as produced by `dateRanges.ts#getQuickRanges`. */
export interface ResolvedDateRange {
  from: Date;
  to: Date;
}

/** One selectable "quick range" option (today, last 7 days, this month, ...). */
export interface QuickRangeOption {
  key: string;
  label: string;
  resolve: () => ResolvedDateRange;
}

/** Input accepted by `resolveMonthRange`. */
export interface MonthRangeInput {
  fromMonth: number | string;
  toMonth: number | string;
  year: number | string;
}

/** Public return value of the `useSalesReport` hook. */
export interface UseSalesReportResult {
  records: SalesRecord[];
  status: ReportStatus;
  error: ApiError | null;

  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  hasData: boolean;

  analytics: DashboardAnalytics;

  runReport: (range: DateRangeInput) => Promise<void>;
  retry: () => void;
}
