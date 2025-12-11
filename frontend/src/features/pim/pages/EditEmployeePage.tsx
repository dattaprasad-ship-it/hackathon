import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { EmployeeForm } from '../components/EmployeeForm';
import { employeesService } from '../services/employeesService';
import { Button } from '@/components/ui/button';
import type { UpdateEmployeeRequest } from '../types/employees.types';

export const EditEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [employee, setEmployee] = React.useState<any>(null);
  const [loadingEmployee, setLoadingEmployee] = React.useState(true);

  React.useEffect(() => {
    const loadEmployee = async () => {
      if (!id) {
        setError('Employee ID is required');
        setLoadingEmployee(false);
        return;
      }

      try {
        setLoadingEmployee(true);
        const data = await employeesService.getById(id);
        setEmployee(data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to load employee';
        setError(errorMessage);
      } finally {
        setLoadingEmployee(false);
      }
    };

    loadEmployee();
  }, [id]);

  const handleSubmit = async (data: UpdateEmployeeRequest) => {
    if (!id) {
      setError('Employee ID is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await employeesService.update(id, data);
      navigate('/pim');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to update employee';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/pim');
  };

  if (loadingEmployee) {
    return (
      <DashboardLayout pageTitle="Edit Employee">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !employee) {
    return (
      <DashboardLayout pageTitle="Edit Employee">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
        <Button onClick={handleCancel}>Back to Employee List</Button>
      </DashboardLayout>
    );
  }

  if (!employee) {
    return (
      <DashboardLayout pageTitle="Edit Employee">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4" role="alert">
          Employee not found
        </div>
        <Button onClick={handleCancel}>Back to Employee List</Button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Edit Employee">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}

      <EmployeeForm
        initialData={{
          employeeId: employee.employeeId,
          firstName: employee.firstName,
          middleName: employee.middleName,
          lastName: employee.lastName,
          username: employee.username,
          loginStatus: employee.loginStatus,
          createLoginDetails: !!employee.username,
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </DashboardLayout>
  );
};

