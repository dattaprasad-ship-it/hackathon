import { useState } from 'react';
import { employeesService } from '../services/employeesService';
import type { CreateEmployeeRequest, Employee } from '../types/employees.types';

export const useCreateEmployee = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEmployee = async (data: CreateEmployeeRequest): Promise<Employee | null> => {
    setLoading(true);
    setError(null);

    try {
      const employee = await employeesService.create(data);
      return employee;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to create employee';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createEmployee,
    loading,
    error,
  };
};

