import { useCallback, useMemo, useState } from 'react';
import { getSalesReport } from '../api/salesApi';

import {
  calculateKPIs,
  getTopSellers,
  getTopCustomers,
  getTopProducts,
  getSalesByCategory,
  getTopReturnedCustomers,
  getTopReturnedSellers,
  getSalesTrend,
  getSalesByMonths,
} from '../utils/analytics';

import type { SalesRecord, ApiError } from '../types/api';
import type { DashboardAnalytics } from '../types/analytics';
import type {
  DateRangeInput,
  ReportStatus,
  UseSalesReportResult,
} from '../types/sales';

const STATUS: Record<string, ReportStatus> = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

/**
 * Converts the date/time values from the Dashboard
 * into the format expected by the Sales API.
 *
 * API expects:
 * trans_date_gte=YYYY-MM-DDTHH:mm
 * trans_date_lte=YYYY-MM-DDTHH:mm
 */
function normalizeDateTime(
  value: string | null | undefined,
  defaultTime = '09:00'
): string | null {
  if (!value) {
    return null;
  }

  // If the value already contains a time, use it as-is.
  if (value.includes('T')) {
    return value.slice(0, 16);
  }

  // If only a date was selected, use the default time.
  return `${value}T${defaultTime}`;
}

/**
 * Encapsulates fetching the sales report and deriving every dashboard
 * metric from it.
 */
export function useSalesReport(): UseSalesReportResult {
  const [records, setRecords] = useState<SalesRecord[]>([]);
  const [status, setStatus] = useState<ReportStatus>(STATUS.IDLE);
  const [error, setError] = useState<ApiError | null>(null);
  const [lastRange, setLastRange] = useState<DateRangeInput | null>(null);

  /**
   * Run sales report.
   */
  const runReport = useCallback(async ({ dateFrom, dateTo }: DateRangeInput) => {
    setStatus(STATUS.LOADING);
    setError(null);

    try {
      const transDateGte = normalizeDateTime(dateFrom, '09:00');
      const transDateLte = normalizeDateTime(dateTo, '09:00');

      if (!transDateGte || !transDateLte) {
        throw new Error('dateFrom and dateTo are required');
      }

      const results = await getSalesReport({
        transDateGte,
        transDateLte,
      });

      setRecords(results);

      // Keep the original Dashboard values
      // so retry can use exactly the same range.
      setLastRange({ dateFrom, dateTo });

      setStatus(STATUS.SUCCESS);
    } catch (err) {
      setError(err as ApiError);
      setStatus(STATUS.ERROR);
    }
  }, []);

  /**
   * Retry the last report.
   */
  const retry = useCallback(() => {
    if (lastRange) {
      runReport(lastRange);
    }
  }, [lastRange, runReport]);

  /**
   * Calculate all dashboard analytics.
   */
  const analytics = useMemo<DashboardAnalytics>(() => {
    /**
     * No records.
     */
    if (!records || records.length === 0) {
      return {
        kpis: calculateKPIs([]),
        topSellers: [],
        topCustomers: [],
        topProducts: [],
        salesByCategory: [],
        topReturnedCustomers: [],
        topReturnedSellers: [],
        salesTrend: [],
        salesByMonths: [],
      };
    }

    /**
     * Monthly sales.
     *
     * Uses the selected Dashboard range.
     *
     * Only:
     * - sale
     * - service_sale
     *
     * are included by getSalesByMonths().
     */
    const salesByMonths = getSalesByMonths(
      records,
      lastRange?.dateFrom,
      lastRange?.dateTo
    );

    return {
      kpis: calculateKPIs(records),

      topSellers: getTopSellers(records, 5),

      topCustomers: getTopCustomers(records, 5),

      topProducts: getTopProducts(records, 10),

      salesByCategory: getSalesByCategory(records),

      topReturnedCustomers: getTopReturnedCustomers(records, 5),

      topReturnedSellers: getTopReturnedSellers(records, 5),

      salesTrend: getSalesTrend(records),

      salesByMonths,
    };
  }, [records, lastRange]);

  return {
    records,
    status,
    error,

    isLoading: status === STATUS.LOADING,

    isError: status === STATUS.ERROR,

    isEmpty: status === STATUS.SUCCESS && records.length === 0,

    hasData: status === STATUS.SUCCESS && records.length > 0,

    analytics,

    runReport,
    retry,
  };
}
