/**
 * Types for the "الأرصدة المالية" (Financial Balances) feature.
 *
 * Backed by:
 *   GET /api/v2/dropdown/sub-accounts/?type_account=1&page_size=100
 */

/** One sub-account exactly as returned by the dropdown API. */
export interface SubAccountRecord {
  pk: number;
  name: string;
  /** Current balance. Positive or negative. */
  rest: number;
}

export interface SubAccountsPage {
  count: number;
  next: string | null;
  previous: string | null;
  results: SubAccountRecord[];
}

export interface SubAccountsApiResponse {
  success: boolean;
  message: string;
  errors: unknown[];
  data: SubAccountsPage;
}

/** The three sections shown on the Financial Balances page. */
export type BalanceCategory = 'treasury' | 'bank' | 'wallet';

/** A sub-account after being classified into one of the three sections. */
export interface FinancialBalanceItem extends SubAccountRecord {
  category: BalanceCategory;
}

/** One section's cards + its own subtotal/count. */
export interface BalanceCategoryGroup {
  category: BalanceCategory;
  label: string;
  description: string;
  icon: string;
  items: FinancialBalanceItem[];
  total: number;
  count: number;
}

/** Everything the page needs, already grouped + totalled. */
export interface FinancialBalancesSummary {
  treasury: BalanceCategoryGroup;
  bank: BalanceCategoryGroup;
  wallet: BalanceCategoryGroup;
  /** Sum of treasury + bank + wallet totals only (excluded accounts are not counted). */
  grandTotal: number;
}

/** Filter tabs above the sections. */
export type BalanceCategoryFilter = 'all' | BalanceCategory;
