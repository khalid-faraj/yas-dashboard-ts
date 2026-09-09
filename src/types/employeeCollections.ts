/**
 * Types for "إحصائيات تحصيل البائعين" (Vendor Collection Statistics).
 *
 * Backed by:
 *   GET /api/v2/reports-accounts/cash-collection/?from_date=...&to_date=...&emplyee__pk__in=...
 */

export interface WinnerClient {
  client_name: string;
  collection_amount: number;
}

/** One employee's collection summary for the selected date range. */
export interface EmployeeCollectionRecord {
  employee_name: string;
  transactions_count: number;
  /** Note: spelled exactly as the backend returns it ("emplyee", not "employee"). */
  total_emplyee_collection: number;
  winner_client: WinnerClient;
}

export interface CashCollectionApiResponse {
  success: boolean;
  message: string;
  data: EmployeeCollectionRecord[];
  errors: unknown[];
}

/**
 * Query params for the request. All are optional — the backend does not
 * require every one of them to be present.
 */
export interface CashCollectionQueryParams {
  from_date?: string;
  to_date?: string;
  /** Optional list of employee pks to filter by (not currently exposed in the UI). */
  employeePks?: number[];
}

/** The three date-filter modes on the page. */
export type CollectionsDateFilterMode = 'lastWeek' | 'currentMonth' | 'custom';

/** A resolved `{ fromDate, toDate }` pair in `YYYY-MM-DD` (API-ready, no time). */
export interface CollectionsDateRange {
  fromDate: string;
  toDate: string;
}

/** One bar in either collections chart. */
export interface CollectionChartDatum {
  name: string;
  value: number;
  /** Only populated for the employees chart (extra tooltip detail). */
  transactionsCount?: number;
}
