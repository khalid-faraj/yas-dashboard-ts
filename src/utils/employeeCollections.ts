import type {
  CollectionChartDatum,
  EmployeeCollectionRecord,
} from '../types/employeeCollections';

/** Sum of every employee's total collection for the period. */
export function getEmployeesCollectionTotal(
  records: EmployeeCollectionRecord[]
): number {
  return records.reduce((sum, r) => sum + r.total_emplyee_collection, 0);
}

/** Sum of every employee's top ("winner") client collection amount. */
export function getTopClientsCollectionTotal(
  records: EmployeeCollectionRecord[]
): number {
  return records.reduce((sum, r) => sum + r.winner_client.collection_amount, 0);
}

/**
 * All employees, sorted by collection amount descending — every single
 * one returned by the API, never limited to a top-N slice.
 */
export function buildEmployeesChartData(
  records: EmployeeCollectionRecord[]
): CollectionChartDatum[] {
  return [...records]
    .map((r) => ({
      name: r.employee_name,
      value: r.total_emplyee_collection,
      transactionsCount: r.transactions_count,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Each employee's top ("winner") client, sorted by collection amount
 * descending. If two employees share the same top client, both entries
 * are kept as-is (not merged) since the API gives no client identifier
 * to merge on safely.
 */
export function buildTopClientsChartData(
  records: EmployeeCollectionRecord[]
): CollectionChartDatum[] {
  return [...records]
    .map((r) => ({
      name: r.winner_client.client_name,
      value: r.winner_client.collection_amount,
    }))
    .sort((a, b) => b.value - a.value);
}
