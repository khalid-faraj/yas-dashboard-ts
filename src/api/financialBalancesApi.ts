import { httpClient } from '../services/httpClient';
import type { SubAccountRecord, SubAccountsApiResponse } from '../types/financialBalances';

const SUB_ACCOUNTS_ENDPOINT = '/api/v2/dropdown/sub-accounts/';

/**
 * `type_account=1` selects cash/bank-style sub-accounts (treasuries, banks,
 * wallets). `page_size=100` is enough to fetch every sub-account in one call
 * for this dropdown — it is not user-configurable.
 */
const TYPE_ACCOUNT = 1;
const PAGE_SIZE = 100;


/**
 * Fetches every sub-account (treasuries, banks, wallets, ...) used to build
 * the "الأرصدة المالية" page. Returns the raw records — classification into
 * sections happens in `utils/financialBalances.ts`.
 */
export async function getFinancialSubAccounts(): Promise<SubAccountRecord[]> {
  const response = await httpClient.get<SubAccountsApiResponse>(
    SUB_ACCOUNTS_ENDPOINT,
    {
      

      params: {
        type_account: TYPE_ACCOUNT,
        page_size: PAGE_SIZE,
      },
    }
  );

  const results = response.data?.data?.results;

  return Array.isArray(results) ? results : [];
}
