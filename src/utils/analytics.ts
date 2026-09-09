// Pure data-transformation functions for the sales dashboard.
// Kept free of any React/UI concerns so they're easy to test and memoize.

import type { SalesRecord, SaleType } from '../types/api';
import type {
  CategoryEntry,
  KpiMetrics,
  MonthlySalesPoint,
  RankedQuantityEntry,
  RankedValueEntry,
  ReturnEntry,
  SalesTrendPoint,
} from '../types/analytics';

const NO_NAME_LABEL = 'غير محدد';

/**
 * Safely reads a numeric field from a record, defaulting to 0.
 */
function num(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Computes the signed line value for a single record: s_price * count.
 *
 * Positive => sale
 * Negative => return
 */
export function getLineValue(record: SalesRecord): number {
  return num(record.s_price) * num(record.count);
}

function safeName(value: unknown): string {
  if (value === null || value === undefined) {
    return NO_NAME_LABEL;
  }

  const trimmed = String(value).trim();

  return trimmed.length > 0 ? trimmed : NO_NAME_LABEL;
}

/**
 * Determines whether a record is a normal sale.
 *
 * These are the two types that should be included
 * in the main sales KPIs:
 *
 * - sale
 * - service_sale
 */
function isSalesRecord(record: SalesRecord): boolean {
  const saleTypes: SaleType[] = ['sale', 'service_sale'];
  return saleTypes.includes(record.type_sale);
}

/**
 * Determines whether a record is a return.
 */
function isReturnRecord(record: SalesRecord): boolean {
  return record.type_sale === 'return_sale';
}

/**
 * Determines the best available product identifier for a record.
 */
function getProductIdentifier(record: SalesRecord): string {
  return safeName(
    record.description || record.container_code || record.category_name
  );
}

/**
 * Calculates the top-level KPI metrics for the dashboard.
 *
 * Main sales KPIs are calculated ONLY from:
 *
 * - sale
 * - service_sale
 *
 * Returns are calculated separately from:
 *
 * - return_sale
 *
 * This prevents return invoices/customers from affecting:
 *
 * - invoice count
 * - client count
 * - average invoice value
 *
 * while still keeping returns available for the returns analysis.
 */
export function calculateKPIs(records: SalesRecord[]): KpiMetrics {
  let grossSales = 0;
  let returns = 0;

  // Only sale + service_sale
  const salesRecords = records.filter(isSalesRecord);

  // Only return_sale
  const returnRecords = records.filter(isReturnRecord);

  /**
   * Gross sales
   *
   * Only sale + service_sale.
   */
  for (const record of salesRecords) {
    const lineValue = getLineValue(record);

    // Use absolute value defensively in case
    // the backend ever sends a negative count.
    grossSales += Math.abs(lineValue);
  }

  /**
   * Returns
   *
   * Only return_sale.
   *
   * Stored as a positive magnitude.
   */
  for (const record of returnRecords) {
    const lineValue = getLineValue(record);

    returns += Math.abs(lineValue);
  }

  /**
   * Net sales.
   *
   * Gross sales - returns.
   */
  const netSales = grossSales - returns;

  /**
   * Invoice count.
   *
   * IMPORTANT:
   * Only sale + service_sale are included.
   */
  const invoiceSet = new Set<string | number>();

  for (const record of salesRecords) {
    if (record.invoice_pk !== undefined && record.invoice_pk !== null) {
      invoiceSet.add(record.invoice_pk as string | number);
    }
  }

  const invoiceCount = invoiceSet.size;

  /**
   * Client count.
   *
   * IMPORTANT:
   * Only sale + service_sale are included.
   */
  const clientSet = new Set<string>();

  for (const record of salesRecords) {
    if (record.client__name) {
      clientSet.add(record.client__name);
    }
  }

  const clientCount = clientSet.size;

  /**
   * Average invoice value.
   *
   * IMPORTANT:
   *
   * This is based on gross sales, NOT net sales.
   *
   * Because returns are separate transactions and
   * must not reduce the average value of a sale invoice.
   *
   * Formula:
   *
   * gross sales / number of sales invoices
   */
  const averageInvoiceValue = invoiceCount > 0 ? grossSales / invoiceCount : 0;

  return {
    grossSales,
    returns,
    netSales,
    invoiceCount,
    clientCount,
    averageInvoiceValue,
  };
}

/**
 * Generic grouping-and-summing helper.
 *
 * @private
 */
function groupSumBy<T>(
  records: T[],
  keyFn: (record: T) => string,
  valueFn: (record: T) => number
): Map<string, number> {
  const map = new Map<string, number>();

  for (const record of records) {
    const key = keyFn(record);
    const value = valueFn(record);

    map.set(key, (map.get(key) || 0) + value);
  }

  return map;
}

/**
 * Returns the top N sellers ranked by sales value.
 *
 * Only:
 *
 * - sale
 * - service_sale
 *
 * are included.
 */
export function getTopSellers(
  records: SalesRecord[],
  limit = 5
): RankedValueEntry[] {
  const salesRecords = records.filter(isSalesRecord);

  const map = groupSumBy(
    salesRecords,
    (r) => safeName(r.employee__name),
    (r) => Math.abs(getLineValue(r))
  );

  const entries = Array.from(map.entries())
    .filter(([name]) => name !== NO_NAME_LABEL)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);

  const max = entries.length > 0 ? entries[0].value : 0;

  return entries.map((entry) => ({
    ...entry,
    percentOfTop: max > 0 ? (entry.value / max) * 100 : 0,
  }));
}

/**
 * Returns the top N customers ranked by sales value.
 *
 * Only:
 *
 * - sale
 * - service_sale
 *
 * are included.
 */
export function getTopCustomers(
  records: SalesRecord[],
  limit = 5
): RankedValueEntry[] {
  const salesRecords = records.filter(isSalesRecord);

  const map = groupSumBy(
    salesRecords,
    (r) => safeName(r.client__name),
    (r) => Math.abs(getLineValue(r))
  );

  const entries = Array.from(map.entries())
    .filter(([name]) => name !== NO_NAME_LABEL)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);

  const max = entries.length > 0 ? entries[0].value : 0;

  return entries.map((entry) => ({
    ...entry,
    percentOfTop: max > 0 ? (entry.value / max) * 100 : 0,
  }));
}

/**
 * Returns the top N products ranked by quantity sold.
 *
 * Only:
 *
 * - sale
 * - service_sale
 *
 * are included.
 */
export function getTopProducts(
  records: SalesRecord[],
  limit = 10
): RankedQuantityEntry[] {
  const salesRecords = records.filter(isSalesRecord);

  const map = groupSumBy(
    salesRecords,
    (r) => getProductIdentifier(r),
    (r) => Math.abs(num(r.count))
  );

  const entries = Array.from(map.entries())
    .filter(([name]) => name !== NO_NAME_LABEL)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);

  const max = entries.length > 0 ? entries[0].quantity : 0;

  return entries.map((entry) => ({
    ...entry,
    percentOfTop: max > 0 ? (entry.quantity / max) * 100 : 0,
  }));
}

/**
 * Groups sales by category for the donut chart.
 *
 * Only:
 *
 * - sale
 * - service_sale
 *
 * are included.
 */
export function getSalesByCategory(records: SalesRecord[]): CategoryEntry[] {
  const salesRecords = records.filter(isSalesRecord);

  const map = groupSumBy(
    salesRecords,
    (r) => safeName(r.category_name),
    (r) => Math.abs(getLineValue(r))
  );

  const entries = Array.from(map.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  const total = entries.reduce((sum, entry) => sum + entry.value, 0);

  return entries
    .map((entry) => ({
      ...entry,
      percentage: total !== 0 ? (entry.value / total) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Returns the top N customers by return value.
 *
 * Only return_sale records are included.
 */
export function getTopReturnedCustomers(
  records: SalesRecord[],
  limit = 5
): ReturnEntry[] {
  const returnLines = records.filter(isReturnRecord);

  const valueMap = groupSumBy(
    returnLines,
    (r) => safeName(r.client__name),
    (r) => Math.abs(getLineValue(r))
  );

  const qtyMap = groupSumBy(
    returnLines,
    (r) => safeName(r.client__name),
    (r) => Math.abs(num(r.count))
  );

  return Array.from(valueMap.entries())
    .filter(([name]) => name !== NO_NAME_LABEL)
    .map(([name, value]) => ({
      name,
      value,
      quantity: qtyMap.get(name) || 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

/**
 * Returns the top N sellers by return value.
 *
 * Only return_sale records are included.
 */
export function getTopReturnedSellers(
  records: SalesRecord[],
  limit = 5
): ReturnEntry[] {
  const returnLines = records.filter(isReturnRecord);

  const valueMap = groupSumBy(
    returnLines,
    (r) => safeName(r.employee__name),
    (r) => Math.abs(getLineValue(r))
  );

  const qtyMap = groupSumBy(
    returnLines,
    (r) => safeName(r.employee__name),
    (r) => Math.abs(num(r.count))
  );

  return Array.from(valueMap.entries())
    .filter(([name]) => name !== NO_NAME_LABEL)
    .map(([name, value]) => ({
      name,
      value,
      quantity: qtyMap.get(name) || 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

/**
 * Builds a daily sales trend series across the selected date range.
 *
 * Main sales:
 * - sale
 * - service_sale
 *
 * Returns:
 * - return_sale
 *
 * Output:
 * - gross
 * - returns
 * - net
 */
export function getSalesTrend(records: SalesRecord[]): SalesTrendPoint[] {
  const map = new Map<string, SalesTrendPoint>();

  for (const record of records) {
    const rawDate = record.date_invoice;

    if (!rawDate) {
      continue;
    }

    const day = String(rawDate).slice(0, 10);

    if (!map.has(day)) {
      map.set(day, {
        date: day,
        gross: 0,
        returns: 0,
        net: 0,
      });
    }

    const bucket = map.get(day)!;

    const lineValue = getLineValue(record);

    if (isSalesRecord(record)) {
      bucket.gross += Math.abs(lineValue);
      bucket.net += Math.abs(lineValue);
    } else if (isReturnRecord(record)) {
      const returnValue = Math.abs(lineValue);

      bucket.returns += returnValue;
      bucket.net -= returnValue;
    }
  }

  return Array.from(map.values()).sort((a, b) => (a.date > b.date ? 1 : -1));
}

/**
 * Builds monthly sales across the selected date range.
 *
 * Gross sales:
 * - sale
 * - service_sale
 *
 * Returns:
 * - return_sale
 *
 * Net sales:
 * - gross sales - returns
 *
 * Output:
 * {
 *   month: '2026-04',
 *   value: 100000,   // gross sales - kept for existing chart
 *   gross: 100000,
 *   returns: 15000,
 *   net: 85000
 * }
 */
export function getSalesByMonths(
  records: SalesRecord[],
  dateFrom?: string | null,
  dateTo?: string | null
): MonthlySalesPoint[] {
  const map = new Map<
    string,
    { gross: number; returns: number; net: number }
  >();

  // -----------------------------------------
  // 1. Create every month in selected range
  // -----------------------------------------
  const start = new Date(dateFrom ?? '');
  const end = new Date(dateTo ?? '');

  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  end.setDate(1);
  end.setHours(0, 0, 0, 0);

  const cursor = new Date(start);

  while (cursor <= end) {
    const monthKey = `${cursor.getFullYear()}-${String(
      cursor.getMonth() + 1
    ).padStart(2, '0')}`;

    map.set(monthKey, {
      gross: 0,
      returns: 0,
      net: 0,
    });

    cursor.setMonth(cursor.getMonth() + 1);
  }

  // -----------------------------------------
  // 2. Process records
  // -----------------------------------------
  for (const record of records) {
    if (!record.date_invoice) {
      continue;
    }

    const monthKey = String(record.date_invoice).slice(0, 7);

    if (!map.has(monthKey)) {
      continue;
    }

    const lineValue = Math.abs(getLineValue(record));

    const bucket = map.get(monthKey)!;

    // ---------------------------------------
    // sale + service_sale
    // ---------------------------------------
    if (isSalesRecord(record)) {
      bucket.gross += lineValue;
      bucket.net += lineValue;
    }

    // ---------------------------------------
    // return_sale
    // ---------------------------------------
    else if (isReturnRecord(record)) {
      bucket.returns += lineValue;
      bucket.net -= lineValue;
    }
  }

  // -----------------------------------------
  // 3. Convert Map to chart data
  // -----------------------------------------
  return Array.from(map.entries()).map(([month, values]) => ({
    month,

    // Existing sales chart
    value: values.gross,

    // Explicit values for future charts
    gross: values.gross,
    returns: values.returns,
    net: values.net,
  }));
}
