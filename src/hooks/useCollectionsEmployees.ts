import { useEffect, useState } from 'react';
import { getCollectionsEmployees } from '../api/employeesApi';
import type { EmployeeOption } from '../types/employeeCollections';

export interface UseCollectionsEmployeesResult {
  employees: EmployeeOption[];
  isLoading: boolean;
}

export function useCollectionsEmployees(): UseCollectionsEmployeesResult {
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);

    getCollectionsEmployees()
      .then((list) => {
        if (!cancelled) {
          setEmployees(list);
        }
      })
      .catch(() => {
        // The employee filter is a nice-to-have; if it fails to load, the
        // page still works fine with the "all employees" view.
        if (!cancelled) {
          setEmployees([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { employees, isLoading };
}
