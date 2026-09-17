import { httpClient } from "../services/httpClient";
import type {
  CashCollectionApiResponse,
  CashCollectionQueryParams,
  CashCollectionRecord,
} from "../types/employeeCollections";

const CASH_COLLECTION_ENDPOINT = "/api/v2/reports-accounts/cash-collection/";

/**
 * Fetch the cash-collection report from the API.
 *
 * NOTE: "emplyee" is spelled exactly as the backend expects — this is the
 * backend's own param name, not a typo to "fix" here.
 */
async function fetchCashCollection({
  from_date,
  to_date,
  employeePks,
}: CashCollectionQueryParams): Promise<CashCollectionApiResponse> {
  const response = await httpClient.get<CashCollectionApiResponse>(
    CASH_COLLECTION_ENDPOINT,
    {
      params: {
        from_date,
        to_date,

        emplyee__pk__in:
          employeePks && employeePks.length > 0
            ? employeePks.join(",")
            : undefined,
      },
    },
  );

  return response.data;
}

/**
 * Extract results from API response.
 */
function extractResults(
  payload: CashCollectionApiResponse | undefined,
): CashCollectionRecord[] {
  const results = payload?.data;

  return Array.isArray(results) ? results : [];
}

/**
 * Fetch the complete cash-collection report for an optional date/time
 * range and/or set of employees.
 *
 * NOTE: this report is not paginated — the backend returns every matching
 * employee/client row in a single response.
 */
export async function getEmployeeCashCollections(
  params: CashCollectionQueryParams,
): Promise<CashCollectionRecord[]> {
  const payload = await fetchCashCollection(params);

  return extractResults(payload);
}