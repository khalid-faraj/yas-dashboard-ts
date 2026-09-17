import DashboardHeader from '../components/layout/DashboardHeader';
import CollectionsDateFilter from '../components/employee-collections/CollectionsDateFilter';
import RankingList from '../components/rankings/RankingList';
import EmployeeTotalCard from '../components/employee-collections/EmployeeTotalCard';
import CollectionsLoadingSkeleton from '../components/employee-collections/CollectionsLoadingSkeleton';
import CollectionsEmptyState from '../components/employee-collections/CollectionsEmptyState';
import CollectionsErrorState from '../components/employee-collections/CollectionsErrorState';

import { useCollectionsEmployees } from '../hooks/useCollectionsEmployees';
import { useEmployeeCollections } from '../hooks/useEmployeeCollections';

export default function EmployeeCollectionsPage(): JSX.Element {
  const { employees, isLoading: employeesLoading } = useCollectionsEmployees();

  const {
    status,
    isLoading,
    isError,
    isEmpty,
    selectedEmployeePk,
    employeesRanking,
    clientsRanking,
    totalCollection,
    runReport,
    retry,
  } = useEmployeeCollections();

  const selectedEmployee = employees.find((e) => e.pk === selectedEmployeePk);

  return (
    <div>
      <DashboardHeader
        title="إحصائيات تحصيل البائعين"
        subtitle="تحليل تحصيلات البائعين وأفضل عملائهم خلال الفترة المحددة"
      />

      <CollectionsDateFilter
        employees={employees}
        employeesLoading={employeesLoading}
        onSubmit={runReport}
        isLoading={isLoading}
      />

      {isLoading && <CollectionsLoadingSkeleton />}

      {!isLoading && isError && <CollectionsErrorState onRetry={retry} />}

      {!isLoading && !isError && status === 'success' && (
        selectedEmployeePk !== undefined ? (
          // A specific vendor is selected: show their name + total, then
          // every client they collected from during the period.
          <>
            <EmployeeTotalCard
              employeeName={selectedEmployee?.name ?? '—'}
              total={totalCollection}
            />

            <RankingList
              title="العملاء اللي تم التحصيل منهم"
              items={clientsRanking}
              emptyLabel="لا توجد تحصيلات لهذا البائع في هذه الفترة"
            />
          </>
        ) : isEmpty ? (
          <CollectionsEmptyState />
        ) : (
          // No vendor filter: every vendor's collections, ranked, with
          // medals on the top 3 — then every client, ranked, across all
          // vendors.
          <>
            <RankingList
              title="تحصيلات البائعين"
              items={employeesRanking}
              emptyLabel="لا توجد بيانات تحصيل لهذه الفترة"
              showMedalsForTop3
            />

            <RankingList
              title="أكثر العملاء تم التحصيل منهم"
              items={clientsRanking}
              emptyLabel="لا توجد بيانات عملاء لهذه الفترة"
            />
          </>
        )
      )}
    </div>
  );
}
