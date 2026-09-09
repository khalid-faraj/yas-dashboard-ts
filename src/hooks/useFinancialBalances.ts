import { useCallback, useEffect, useMemo, useState } from 'react';
import { getFinancialSubAccounts } from '../api/financialBalancesApi';
import { buildFinancialBalancesSummary } from '../utils/financialBalances';
import type { SubAccountRecord } from '../types/financialBalances';
import type { ApiError } from '../types/api';
import type { ReportStatus } from '../types/sales';
import type { FinancialBalancesSummary } from '../types/financialBalances';

export interface UseFinancialBalancesResult {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  hasData: boolean;
  error: ApiError | null;
  summary: FinancialBalancesSummary;
  retry: () => void;
}

const EMPTY_RECORDS: SubAccountRecord[] = [];

export function useFinancialBalances(): UseFinancialBalancesResult {
  const [records, setRecords] = useState<SubAccountRecord[]>(EMPTY_RECORDS);
  const [status, setStatus] = useState<ReportStatus>('idle');
  const [error, setError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      const results = await getFinancialSubAccounts();
      setRecords(results);
      setStatus('success');
    } catch (err) {
      setError(err as ApiError);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const summary = useMemo(
    () => buildFinancialBalancesSummary(records),
    [records]
  );

  return {
    isLoading: status === 'loading',
    isError: status === 'error',
    isEmpty: status === 'success' && records.length === 0,
    hasData: status === 'success' && records.length > 0,
    error,
    summary,
    retry: load,
  };
}
