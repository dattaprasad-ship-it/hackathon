import { useState, useEffect, useCallback } from 'react';
import { employeesService } from '../services/employeesService';
import type { Employee, EmployeeListFilters, EmployeeListResponse } from '../types/employees.types';

export const useEmployees = (initialFilters?: EmployeeListFilters) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<EmployeeListResponse['pagination'] | null>(null);
  const [recordCount, setRecordCount] = useState<string>('(0) Records Found');
  const [filters, setFilters] = useState<EmployeeListFilters>(initialFilters || {});

  const fetchEmployees = useCallback(async (currentFilters?: EmployeeListFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await employeesService.list(currentFilters || filters);
      setEmployees(response.data);
      setPagination(response.pagination);
      setRecordCount(response.recordCount);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to fetch employees';
      setError(errorMessage);
      setEmployees([]);
      setPagination(null);
      setRecordCount('(0) Records Found');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const updateFilters = useCallback((newFilters: Partial<EmployeeListFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ page: 1, limit: 50, include: 'current' });
  }, []);

  const refresh = useCallback(() => {
    fetchEmployees(filters);
  }, [fetchEmployees, filters]);

  return {
    employees,
    loading,
    error,
    pagination,
    recordCount,
    filters,
    updateFilters,
    resetFilters,
    refresh,
    fetchEmployees,
  };
};

