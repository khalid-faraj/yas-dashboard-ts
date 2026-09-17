import { httpClient } from '../services/httpClient';
import type {
  EmployeeOption,
  EmployeesDropdownApiResponse,
} from '../types/employeeCollections';

const EMPLOYEES_DROPDOWN_ENDPOINT = '/api/v2/dropdown/employees/';

// Departments used to scope the vendor list, exactly as requested.
const DEPARTMENT_IN = '07,08';
const PAGE_SIZE = 100;

/**
 * Fetches the list of employees (vendors) for the collections filter
 * dropdown.
 *
 * NOTE: assumes the same `{ data: { results: [...] } }` envelope as the
 * sub-accounts dropdown already used elsewhere in this app — adjust here
 * if the real response shape turns out to differ.
 */
export async function getCollectionsEmployees(): Promise<EmployeeOption[]> {
  const response = await httpClient.get<EmployeesDropdownApiResponse>(
    EMPLOYEES_DROPDOWN_ENDPOINT,
    {
      params: {
        department_in: DEPARTMENT_IN,
        page_size: PAGE_SIZE,
      },
    }
  );

  const results = response.data?.data?.results;

  return Array.isArray(results) ? results : [];
}