/**
 * Types for derived dashboard analytics (everything produced by
 * `utils/analytics.ts` from a list of `SalesRecord`s).
 */

export interface KpiMetrics {
  grossSales: number;
  returns: number;
  netSales: number;
  invoiceCount: number;
  clientCount: number;
  averageInvoiceValue: number;
}

/** A single ranked entry (seller/customer) with a value and a relative bar %. */
export interface RankedValueEntry {
  name: string;
  value: number;
  percentOfTop: number;
}

/** A single ranked product entry, ranked by quantity rather than value. */
export interface RankedQuantityEntry {
  name: string;
  quantity: number;
  percentOfTop: number;
}

/** A single return entry (customer/seller) — value + quantity, unranked %. */
export interface ReturnEntry {
  name: string;
  value: number;
  quantity: number;
}

/** One slice of the sales-by-category donut chart. */
export interface CategoryEntry {
  name: string;
  value: number;
  percentage: number;
}

/** One point on the daily sales trend area chart. */
export interface SalesTrendPoint {
  date: string;
  gross: number;
  returns: number;
  net: number;
}

/**
 * One bucket of the monthly sales chart.
 *
 * `value` is kept for the existing chart (equal to `gross`) and `gross`/
 * `returns`/`net` are provided explicitly for future charts, matching the
 * exact shape `getSalesByMonths` already returns.
 */
export interface MonthlySalesPoint {
  month: string;
  value: number;
  gross: number;
  returns: number;
  net: number;
}

/** The full bundle of analytics derived by `useSalesReport`. */
export interface DashboardAnalytics {
  kpis: KpiMetrics;
  topSellers: RankedValueEntry[];
  topCustomers: RankedValueEntry[];
  topProducts: RankedQuantityEntry[];
  salesByCategory: CategoryEntry[];
  topReturnedCustomers: ReturnEntry[];
  topReturnedSellers: ReturnEntry[];
  salesTrend: SalesTrendPoint[];
  salesByMonths: MonthlySalesPoint[];
}
