import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmployeeNameAutocomplete } from './EmployeeNameAutocomplete';
import { useClaimsConfig } from '../hooks/useClaimsConfig';
import type { ClaimSearchFilters, ClaimStatus } from '../types/claims.types';

interface ClaimsSearchFormProps {
  filters: ClaimSearchFilters;
  onFiltersChange: (filters: Partial<ClaimSearchFilters>) => void;
  onReset: () => void;
  onSearch: () => void;
  loading?: boolean;
}

export const ClaimsSearchForm: React.FC<ClaimsSearchFormProps> = ({
  filters,
  onFiltersChange,
  onReset,
  onSearch,
  loading = false,
}) => {
  const { config, loading: configLoading, error: configError } = useClaimsConfig();

  const handleInputChange = (field: keyof ClaimSearchFilters, value: string) => {
    onFiltersChange({ [field]: value || undefined });
  };

  const handleSelectChange = (field: keyof ClaimSearchFilters, value: string) => {
    onFiltersChange({ [field]: value || undefined });
  };

  const handleDateChange = (field: 'fromDate' | 'toDate', value: string) => {
    onFiltersChange({ [field]: value || undefined });
  };

  const validateDateRange = (): boolean => {
    if (filters.fromDate && filters.toDate) {
      return new Date(filters.fromDate) <= new Date(filters.toDate);
    }
    return true;
  };

  const dateRangeError = filters.fromDate && filters.toDate && !validateDateRange();

  const claimStatuses: ClaimStatus[] = [
    'Initiated',
    'Submitted',
    'Pending Approval',
    'Approved',
    'Rejected',
    'Paid',
    'Cancelled',
    'On Hold',
    'Partially Approved',
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-1">
            Employee Name
          </label>
          <EmployeeNameAutocomplete
            id="employeeName"
            value={filters.employeeName || ''}
            onChange={(value) => handleInputChange('employeeName', value)}
            placeholder="Search employee name..."
          />
        </div>

        <div>
          <label htmlFor="referenceId" className="block text-sm font-medium text-gray-700 mb-1">
            Reference ID
          </label>
          <Input
            id="referenceId"
            type="text"
            placeholder="Search by reference ID"
            value={filters.referenceId || ''}
            onChange={(e) => handleInputChange('referenceId', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="eventTypeId" className="block text-sm font-medium text-gray-700 mb-1">
            Event Name
          </label>
          <select
            id="eventTypeId"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            value={filters.eventTypeId || ''}
            onChange={(e) => handleSelectChange('eventTypeId', e.target.value)}
            disabled={configLoading}
          >
            <option value="">All Events</option>
            {(config?.eventTypes || [])
              .filter((et) => et.isActive)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((eventType) => (
                <option key={eventType.id} value={eventType.id}>
                  {eventType.name}
                </option>
              ))}
          </select>
          {configLoading && !config && (
            <p className="mt-1 text-xs text-gray-500">Loading event types...</p>
          )}
          {configError && (
            <p className="mt-1 text-xs text-red-600">Failed to load event types: {configError}</p>
          )}
          {!configLoading && config && (!config.eventTypes || config.eventTypes.length === 0) && (
            <p className="mt-1 text-xs text-yellow-600">No event types available</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filters.status || ''}
            onChange={(e) => handleSelectChange('status', e.target.value as ClaimStatus)}
          >
            <option value="">All Statuses</option>
            {claimStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="include" className="block text-sm font-medium text-gray-700 mb-1">
            Include
          </label>
          <select
            id="include"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filters.include || 'current_employees_only'}
            onChange={(e) => handleSelectChange('include', e.target.value)}
          >
            <option value="current_employees_only">Current Employees Only</option>
            <option value="past_employees_only">Past Employees Only</option>
            <option value="all_employees">All Employees</option>
            <option value="active_claims_only">Active Claims Only</option>
            <option value="closed_claims_only">Closed Claims Only</option>
            <option value="pending_payment">Pending Payment</option>
          </select>
        </div>

        <div>
          <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <Input
            id="fromDate"
            type="date"
            value={filters.fromDate || ''}
            onChange={(e) => handleDateChange('fromDate', e.target.value)}
            className={dateRangeError ? 'border-red-500' : ''}
          />
          {dateRangeError && (
            <p className="mt-1 text-sm text-red-600">From Date must be less than or equal to To Date</p>
          )}
        </div>

        <div>
          <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <Input
            id="toDate"
            type="date"
            value={filters.toDate || ''}
            onChange={(e) => handleDateChange('toDate', e.target.value)}
            className={dateRangeError ? 'border-red-500' : ''}
          />
        </div>

        <div className="flex items-end gap-2 md:col-span-2 lg:col-span-3">
          <Button onClick={onSearch} disabled={loading || dateRangeError} className="flex-1">
            {loading ? 'Searching...' : 'Search'}
          </Button>
          <Button variant="outline" onClick={onReset} disabled={loading}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

