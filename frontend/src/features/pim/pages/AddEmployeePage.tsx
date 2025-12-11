import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { EmployeeForm } from '../components/EmployeeForm';
import { useCreateEmployee } from '../hooks/useCreateEmployee';
import type { CreateEmployeeRequest } from '../types/employees.types';

export const AddEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const { createEmployee, loading, error } = useCreateEmployee();

  const handleSubmit = async (data: CreateEmployeeRequest) => {
    const employee = await createEmployee(data);
    if (employee) {
      navigate('/pim');
    }
  };

  const handleCancel = () => {
    navigate('/pim');
  };

  return (
    <DashboardLayout pageTitle="Add Employee">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}

      <EmployeeForm onSubmit={handleSubmit} onCancel={handleCancel} loading={loading} />
    </DashboardLayout>
  );
};

