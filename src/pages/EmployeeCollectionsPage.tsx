import DashboardHeader from '../components/layout/DashboardHeader';
import CollectionsDateFilter from '../components/employee-collections/CollectionsDateFilter';
import CollectionsSection from '../components/employee-collections/CollectionsSection';
import CollectionsBarChart from '../components/employee-collections/CollectionsBarChart';
import CollectionsLoadingSkeleton from '../components/employee-collections/CollectionsLoadingSkeleton';
import CollectionsEmptyState from '../components/employee-collections/CollectionsEmptyState';
import CollectionsErrorState from '../components/employee-collections/CollectionsErrorState';

import { useEmployeeCollections } from '../hooks/useEmployeeCollections';

export default function EmployeeCollectionsPage(): JSX.Element {
  const {
    isLoading,
    isError,
    isEmpty,
    hasData,
    employeesChartData,
    topClientsChartData,
    employeesTotal,
    topClientsTotal,
    runReport,
    retry,
  } = useEmployeeCollections();

  return (
    <div>
      <DashboardHeader
        title="إحصائيات تحصيل البائعين"
        subtitle="تحليل تحصيلات البائعين وأفضل عملائهم خلال الفترة المحددة"
      />

      <CollectionsDateFilter onSubmit={runReport} isLoading={isLoading} />

      {isLoading && <CollectionsLoadingSkeleton />}

      {!isLoading && isError && <CollectionsErrorState onRetry={retry} />}

      {!isLoading && !isError && isEmpty && <CollectionsEmptyState />}

      {!isLoading && !isError && hasData && (
        <>
          <CollectionsSection
            title="تحصيلات البائعين"
            icon="💵"
            totalLabel="إجمالي تحصيلات البائعين"
            total={employeesTotal}
          >
            <CollectionsBarChart
              data={employeesChartData}
              barColor="#1688e8"
              valueLabel="قيمة التحصيل"
              emptyMessage="لا توجد بيانات تحصيل لهذه الفترة"
            />
          </CollectionsSection>
          <CollectionsSection
            title="العملاء الأكثر تحصيلًا"
            icon="🏆"
          >
            <CollectionsBarChart
              data={topClientsChartData}
              barColor="#16a34a"
              valueLabel="قيمة التحصيل"
              emptyMessage="لا توجد بيانات عملاء لهذه الفترة"
              visibleColumns={10}
            />
          </CollectionsSection>
        </>
      )}
    </div>
  );
}
