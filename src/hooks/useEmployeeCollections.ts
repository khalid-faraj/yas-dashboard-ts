import { useCallback, useMemo, useState } from 'react';
import { getEmployeeCashCollections } from '../api/employeeCollectionsApi';
import {
  buildEmployeesChartData,
  buildTopClientsChartData,
  getEmployeesCollectionTotal,
  getTopClientsCollectionTotal,
} from '../utils/employeeCollections';
import type { ApiError } from '../types/api';
import type { ReportStatus } from '../types/sales';
import type {
  CollectionChartDatum,
  CollectionsDateRange,
  EmployeeCollectionRecord,
} from '../types/employeeCollections';

export interface UseEmployeeCollectionsResult {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  hasData: boolean;
  error: ApiError | null;
  employeesChartData: CollectionChartDatum[];
  topClientsChartData: CollectionChartDatum[];
  employeesTotal: number;
  topClientsTotal: number;
  runReport: (range: CollectionsDateRange) => Promise<void>;
  retry: () => void;
}

export function useEmployeeCollections(): UseEmployeeCollectionsResult {
  const [records, setRecords] = useState<EmployeeCollectionRecord[]>([]);
  const [status, setStatus] = useState<ReportStatus>('idle');
  const [error, setError] = useState<ApiError | null>(null);
  const [lastRange, setLastRange] = useState<CollectionsDateRange | null>(null);

  const runReport = useCallback(async (range: CollectionsDateRange) => {
    setStatus('loading');
    setError(null);

    try {
      const results = await getEmployeeCashCollections({
        from_date: range.fromDate,
        to_date: range.toDate,
      });

      setRecords(results);
      setLastRange(range);
      setStatus('success');
    } catch (err) {
      setError(err as ApiError);
      setStatus('error');
    }
  }, []);

  const retry = useCallback(() => {
    if (lastRange) {
      runReport(lastRange);
    }
  }, [lastRange, runReport]);

  const employeesChartData = useMemo(
    () => buildEmployeesChartData(records),
    [records]
  );

  const topClientsChartData = useMemo(
    () => buildTopClientsChartData(records),
    [records]
  );

  const employeesTotal = useMemo(
    () => getEmployeesCollectionTotal(records),
    [records]
  );

  const topClientsTotal = useMemo(
    () => getTopClientsCollectionTotal(records),
    [records]
  );

  return {
    isLoading: status === 'loading',
    isError: status === 'error',
    isEmpty: status === 'success' && records.length === 0,
    hasData: status === 'success' && records.length > 0,
    error,
    employeesChartData,
    topClientsChartData,
    employeesTotal,
    topClientsTotal,
    runReport,
    retry,
  };
}
