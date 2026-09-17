import { useCallback, useMemo, useState } from 'react';
import { getEmployeeCashCollections } from '../api/employeeCollectionsApi';
import {
  buildClientsRanking,
  buildEmployeesRanking,
  getTotalCollection,
} from '../utils/employeeCollections';
import type { ApiError } from '../types/api';
import type { ReportStatus } from '../types/sales';
import type {
  CashCollectionRecord,
  CollectionsSubmittedQuery,
} from '../types/employeeCollections';
import type { RankingListItem } from '../components/rankings/RankingList';

export interface UseEmployeeCollectionsResult {
  status: ReportStatus;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  error: ApiError | null;
  /** The employee pk currently filtered to, if any. */
  selectedEmployeePk: number | undefined;
  employeesRanking: RankingListItem[];
  clientsRanking: RankingListItem[];
  totalCollection: number;
  runReport: (query: CollectionsSubmittedQuery) => Promise<void>;
  retry: () => void;
}

export function useEmployeeCollections(): UseEmployeeCollectionsResult {
  const [records, setRecords] = useState<CashCollectionRecord[]>([]);
  const [status, setStatus] = useState<ReportStatus>('idle');
  const [error, setError] = useState<ApiError | null>(null);
  const [lastQuery, setLastQuery] = useState<CollectionsSubmittedQuery | null>(
    null
  );

  const runReport = useCallback(async (query: CollectionsSubmittedQuery) => {
    setStatus('loading');
    setError(null);

    try {
      const results = await getEmployeeCashCollections({
        from_date: query.fromDate,
        to_date: query.toDate,
        employeePks: query.employeePk !== undefined ? [query.employeePk] : undefined,
      });

      setRecords(results);
      setLastQuery(query);
      setStatus('success');
    } catch (err) {
      setError(err as ApiError);
      setStatus('error');
    }
  }, []);

  const retry = useCallback(() => {
    if (lastQuery) {
      runReport(lastQuery);
    }
  }, [lastQuery, runReport]);

  const employeesRanking = useMemo(
    () => buildEmployeesRanking(records),
    [records]
  );

  const clientsRanking = useMemo(
    () => buildClientsRanking(records),
    [records]
  );

  const totalCollection = useMemo(
    () => getTotalCollection(records),
    [records]
  );

  return {
    status,
    isLoading: status === 'loading',
    isError: status === 'error',
    isEmpty: status === 'success' && records.length === 0,
    error,
    selectedEmployeePk: lastQuery?.employeePk,
    employeesRanking,
    clientsRanking,
    totalCollection,
    runReport,
    retry,
  };
}
