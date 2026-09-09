import { httpClient } from '../services/httpClient';
import type {
  CashCollectionApiResponse,
  CashCollectionQueryParams,
  EmployeeCollectionRecord,
} from '../types/employeeCollections';

const CASH_COLLECTION_ENDPOINT = '/api/v2/reports-accounts/cash-collection/';


/**
 * Fetches the employee cash-collection report for an optional date range
 * and/or set of employees. All params are optional — axios omits any
 * `undefined` value from the outgoing query string automatically, so
 * callers can pass only what they have.
 */
export async function getEmployeeCashCollections(
  params: CashCollectionQueryParams
): Promise<EmployeeCollectionRecord[]> {
  const { from_date, to_date, employeePks } = params;

  const response = await httpClient.get<CashCollectionApiResponse>(
    CASH_COLLECTION_ENDPOINT,
    {
      
      params: {
        from_date,
        to_date,
        // NOTE: "emplyee" is spelled exactly as the backend expects — this
        // is the backend's own param name, not a typo to "fix" here.
        emplyee__pk__in:
          employeePks && employeePks.length > 0
            ? employeePks.join(',')
            : undefined,
      },
    }
  );

  const results = response.data?.data;

  return Array.isArray(results) ? results : [];
}
