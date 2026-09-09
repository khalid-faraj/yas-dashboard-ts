
import DashboardHeader from '../components/layout/DashboardHeader';
import MonthRangeFilter from '../components/filters/MonthRangeFilter';
import MonthlyNetSalesChart from '../charts/MonthlyNetSalesChart';

import LoadingSkeleton from '../components/states/LoadingSkeleton';
import EmptyState from '../components/states/EmptyState';
import ErrorState from '../components/states/ErrorState';

import { useSalesReport } from '../hooks/useSalesReport';

export default function MonthlySalesStatsPage(): JSX.Element {
  const {
    isLoading,
    isError,
    isEmpty,
    hasData,
    analytics,
    runReport,
    retry,
  } = useSalesReport();

  return (
    <div>
      <DashboardHeader
        title="إحصائيات المبيعات الشهرية"
        subtitle="نظرة عامة على مبيعات كل شهر خلال فترة محددة"
      />

      <MonthRangeFilter onSubmit={runReport} isLoading={isLoading} />

      {isLoading && <LoadingSkeleton />}

      {!isLoading && isError && <ErrorState onRetry={retry} />}

      {!isLoading && !isError && isEmpty && <EmptyState />}

      {!isLoading && !isError && hasData && (
        <MonthlyNetSalesChart data={analytics.salesByMonths} />
      )}
    </div>
  );
}
