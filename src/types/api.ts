/**
 * Types for the sales-reporting API layer.
 *
 * These mirror the exact fields the app currently reads from
 * `/api/v2/reports-accounts/product-sales/` — no fields were invented.
 */

/** The three sale line types the API can return. Always requested together. */
export type SaleType = 'sale' | 'return_sale' | 'service_sale';

/**
 * A single sales/return/service-sale line item as returned by the API.
 *
 * Numeric-looking fields (`s_price`, `count`) are typed as `number | string`
 * because the existing code defensively runs them through `Number(...)`
 * (see `analytics.ts#num`) rather than trusting the API to always send a
 * JS number. Name/lookup fields are optional because the existing code
 * already guards against missing values (see `analytics.ts#safeName`).
 */
export interface SalesRecord {
  type_sale: SaleType;

  s_price?: number | string | null;
  count?: number | string | null;

  invoice_pk?: number | string | null;

  employee__name?: string | null;
  client__name?: string | null;
  category_name?: string | null;

  description?: string | null;
  container_code?: string | null;

  /** ISO-ish date string, e.g. "2026-05-17T09:00:00". */
  date_invoice?: string | null;

  // The API may include additional fields the dashboard doesn't use yet.
  [extraField: string]: unknown;
}

/** DRF-style pagination envelope actually read by `salesApi.ts`. */
export interface SalesApiPage {
  results: SalesRecord[];
  /** Present for DRF-style pagination. */
  next?: string | null;
  /** Present for count-based pagination. */
  count?: number;
}

/** Top-level API response shape: `{ data: { results, next?, count? } }`. */
export interface SalesApiResponse {
  data?: SalesApiPage;
}

/** Query params accepted by `fetchPage` / `getSalesReport`. */
export interface SalesReportParams {
  transDateGte: string;
  transDateLte: string;
}

/** Internal pagination params sent to a single API call. */
export interface SalesApiPageParams extends SalesReportParams {
  page: number;
}

/**
 * Normalized error shape produced by the `httpClient` response
 * interceptor. Every rejected promise from `httpClient` resolves to this.
 */
export interface ApiError {
  status: number | null;
  message: string;
  raw: unknown;
}
