import { formatCurrency } from './formatters';
import type { CashCollectionRecord } from '../types/employeeCollections';
import type { RankingListItem } from '../components/rankings/RankingList';

function aggregateBy(
  records: CashCollectionRecord[],
  keyFn: (record: CashCollectionRecord) => string
): Map<string, number> {
  const map = new Map<string, number>();

  for (const record of records) {
    const key = keyFn(record);
    map.set(key, (map.get(key) || 0) + record.collection_amount);
  }

  return map;
}

function toRankedItems(totals: Map<string, number>): RankingListItem[] {
  const entries = Array.from(totals.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const max = entries.length > 0 ? entries[0].value : 0;

  return entries.map((entry) => ({
    name: entry.name,
    displayValue: formatCurrency(entry.value),
    percentOfTop: max > 0 ? (entry.value / max) * 100 : 0,
  }));
}

/**
 * All employees, ranked by total collections descending. Every employee
 * present in the response is included — never truncated to a top-N slice.
 */
export function buildEmployeesRanking(
  records: CashCollectionRecord[]
): RankingListItem[] {
  return toRankedItems(aggregateBy(records, (r) => r.employee_name));
}

/**
 * All clients, ranked by total collections descending. When the records
 * are already scoped to one employee (the "employee selected" view), this
 * naturally becomes "this employee's clients, ranked" — the same
 * aggregation works for both cases.
 */
export function buildClientsRanking(
  records: CashCollectionRecord[]
): RankingListItem[] {
  return toRankedItems(aggregateBy(records, (r) => r.client_name));
}

/** Sum of every row's collection amount. */
export function getTotalCollection(records: CashCollectionRecord[]): number {
  return records.reduce((sum, r) => sum + r.collection_amount, 0);
}
