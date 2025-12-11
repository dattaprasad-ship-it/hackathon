import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { EmployeeListFilters } from '../types/employees.types';

interface EmployeeSearchProps {
  filters: EmployeeListFilters;
  onFiltersChange: (filters: Partial<EmployeeListFilters>) => void;
  onReset: () => void;
  onSearch: () => void;
}

export const EmployeeSearch: React.FC<EmployeeSearchProps> = ({
  filters,
  onFiltersChange,
  onReset,
  onSearch,
}) => {
  const handleInputChange = (field: keyof EmployeeListFilters, value: string) => {
    onFiltersChange({ [field]: value || undefined });
  };

  const handleSelectChange = (field: keyof EmployeeListFilters, value: string) => {
    onFiltersChange({ [field]: value || undefined });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-1">
            Employee Name
          </label>
          <Input
            id="employeeName"
            type="text"
            placeholder="Search by name"
            value={filters.employeeName || ''}
            onChange={(e) => handleInputChange('employeeName', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
            Employee Id
          </label>
          <Input
            id="employeeId"
            type="text"
            placeholder="Search by ID"
            value={filters.employeeId || ''}
            onChange={(e) => handleInputChange('employeeId', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="include" className="block text-sm font-medium text-gray-700 mb-1">
            Include
          </label>
          <select
            id="include"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filters.include || 'current'}
            onChange={(e) => handleSelectChange('include', e.target.value)}
          >
            <option value="current">Current Employees Only</option>
            <option value="all">All Employees</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <Button onClick={onSearch} className="flex-1">
            Search
          </Button>
          <Button variant="outline" onClick={onReset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

