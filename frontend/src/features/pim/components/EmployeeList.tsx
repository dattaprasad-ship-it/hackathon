import * as React from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { EmployeeSearch } from './EmployeeSearch';
import { EmployeeTable } from './EmployeeTable';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  const {
    employees,
    loading,
    error,
    pagination,
    recordCount,
    filters,
    updateFilters,
    resetFilters,
    refresh,
  } = useEmployees({ page: 1, limit: 50, include: 'current' });

  const [sortBy, setSortBy] = React.useState<string>('createdAt');
  const [sortOrder, setSortOrder] = React.useState<'ASC' | 'DESC'>('DESC');

  const handleSearch = () => {
    updateFilters({ ...filters, page: 1 });
    refresh();
  };

  const handleReset = () => {
    resetFilters();
    setSortBy('createdAt');
    setSortOrder('DESC');
    refresh();
  };

  const handleSort = (field: string) => {
    const newSortOrder = sortBy === field && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    setSortBy(field);
    setSortOrder(newSortOrder);
    updateFilters({ sortBy: field, sortOrder: newSortOrder });
    refresh();
  };

  const handleEdit = (id: string) => {
    navigate(`/pim/employees/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const { employeesService } = await import('../services/employeesService');
        await employeesService.delete(id);
        refresh();
      } catch (error: any) {
        const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to delete employee';
        alert(errorMessage);
      }
    }
  };

  const handleAdd = () => {
    navigate('/pim/employees/new');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employee List</h1>
        <Button onClick={handleAdd}>+ Add</Button>
      </div>

      <EmployeeSearch
        filters={filters}
        onFiltersChange={updateFilters}
        onReset={handleReset}
        onSearch={handleSearch}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4 text-sm text-gray-600">{recordCount}</div>
        <EmployeeTable
          employees={employees}
          loading={loading}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => {
                  updateFilters({ page: pagination.page - 1 });
                  refresh();
                }}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => {
                  updateFilters({ page: pagination.page + 1 });
                  refresh();
                }}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

