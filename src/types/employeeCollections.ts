/**
 * Types for "إحصائيات تحصيل البائعين" (Vendor Collection Statistics).
 *
 * Backed by:
 *   GET /api/v2/reports-accounts/cash-collection/?from_date=...&to_date=...&emplyee__pk__in=...
 *
 * One row per distinct employee/client combination with at least one
 * matching receipt in range — no more nested "winner client" or
 * per-employee totals; those are now derived client-side.
 */
export interface CashCollectionRecord {
  employee_name: string;
  client_name: string;
  collection_amount: number;
}

export interface CashCollectionApiResponse {
  success: boolean;
  message: string;
  data: CashCollectionRecord[];
  errors: unknown[];
}

/**
 * Query params for the request. All optional. Dates are now full
 * datetimes in `YYYY-MM-DD HH:MM:SS` format (space-separated, not ISO).
 */
export interface CashCollectionQueryParams {
  from_date?: string;
  to_date?: string;
  /** Optional list of employee pks to filter by. */
  employeePks?: number[];
}

/** The five date-filter modes on the page. */
export type CollectionsDateFilterMode =
  | 'today'
  | 'yesterday'
  | 'lastWeek'
  | 'currentMonth'
  | 'custom';

/** A resolved `Date` boundary pair for a filter preset. */
export interface ResolvedDateTimeRange {
  from: Date;
  to: Date;
}

/** The `<input type="datetime-local">` controlled values shown in custom mode. */
export interface CollectionsDateTimeInputs {
  fromDateTime: string;
  toDateTime: string;
}

/** What the filter hands up to the page once a range (+ optional employee) is ready. */
export interface CollectionsSubmittedQuery {
  /** `YYYY-MM-DD HH:MM:SS`, ready for the API. */
  fromDate: string;
  toDate: string;
  employeePk?: number;
}

/**
 * One employee option from the dropdown.
 *
 * NOTE: the exact response shape for
 * `GET /api/v2/dropdown/employees/?department_in=07,08&page_size=100`
 * wasn't provided, so this assumes the same envelope as the other
 * dropdown endpoint already used in this app (sub-accounts):
 * `{ success, message, data: { count, next, previous, results: [{ pk, name }] } }`.
 * Adjust `EmployeesDropdownApiResponse`/the mapping in `employeesApi.ts`
 * if the real shape differs.
 */
export interface EmployeeOption {
  pk: number;
  name: string;
}

export interface EmployeesDropdownPage {
  count: number;
  next: string | null;
  previous: string | null;
  results: EmployeeOption[];
}

export interface EmployeesDropdownApiResponse {
  success: boolean;
  message: string;
  data: EmployeesDropdownPage;
  errors: unknown[];
}
