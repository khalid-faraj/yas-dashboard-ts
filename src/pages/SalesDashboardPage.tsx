
import DashboardHeader from '../components/layout/DashboardHeader';
import DateRangeFilter from '../components/filters/DateRangeFilter';

import KpiGrid from '../components/kpi/KpiGrid';

import TopSellers from '../components/rankings/TopSellers';
import TopCustomers from '../components/rankings/TopCustomers';
import TopProducts from '../components/rankings/TopProducts';

import ReturnsCustomers from '../components/rankings/ReturnsCustomers';
import ReturnsSellers from '../components/rankings/ReturnsSellers';

import SalesTrendChart from '../charts/SalesTrendChart';
import SalesByCategory from '../charts/SalesByCategory';

import LoadingSkeleton from '../components/states/LoadingSkeleton';
import EmptyState from '../components/states/EmptyState';
import ErrorState from '../components/states/ErrorState';

import { useSalesReport } from '../hooks/useSalesReport';

import styles from './SalesDashboardPage.module.css';

export default function SalesDashboardPage(): JSX.Element {
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
      <DashboardHeader />

      <DateRangeFilter onSubmit={runReport} isLoading={isLoading} />

      {/* Loading */}
      {isLoading && <LoadingSkeleton />}

      {/* Error */}
      {!isLoading && isError && <ErrorState onRetry={retry} />}

      {/* Empty */}
      {!isLoading && !isError && isEmpty && <EmptyState />}

      {/* Dashboard */}
      {!isLoading && !isError && hasData && (
        <>
          <KpiGrid kpis={analytics.kpis} />

          <div className={styles.section}>
            <SalesTrendChart data={analytics.salesTrend} />
          </div>

          <div className={styles.twoCol}>
            <TopSellers data={analytics.topSellers} />

            <TopCustomers data={analytics.topCustomers} />
          </div>

          <div className={styles.twoColUneven}>
            <TopProducts data={analytics.topProducts} />

            <SalesByCategory data={analytics.salesByCategory} />
          </div>

          <div className={styles.sectionTitle}>تحليل المرتجعات</div>

          <div className={styles.twoCol}>
            <ReturnsCustomers data={analytics.topReturnedCustomers} />

            <ReturnsSellers data={analytics.topReturnedSellers} />
          </div>
        </>
      )}
    </div>
  );
}
