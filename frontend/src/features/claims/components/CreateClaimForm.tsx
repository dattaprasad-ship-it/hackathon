import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmployeeNameAutocomplete } from './EmployeeNameAutocomplete';
import { useClaimsConfig } from '../hooks/useClaimsConfig';
import { useCreateClaim } from '../hooks/useCreateClaim';
import type { CreateClaimRequest } from '../types/claims.types';
import type { Employee } from '@/features/pim/types/employees.types';

const createClaimSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  eventTypeId: z.string().min(1, 'Event is required'),
  currencyId: z.string().min(1, 'Currency is required'),
  remarks: z.string().optional(),
});

interface CreateClaimFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateClaimForm: React.FC<CreateClaimFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { config, loading: configLoading } = useClaimsConfig();
  const { createClaim, loading, error } = useCreateClaim();
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);
  const [employeeName, setEmployeeName] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateClaimRequest>({
    resolver: zodResolver(createClaimSchema),
    defaultValues: {
      employeeId: '',
      eventTypeId: '',
      currencyId: '',
      remarks: '',
    },
  });

  const watchedEmployeeId = watch('employeeId');

  React.useEffect(() => {
    if (selectedEmployee) {
      setValue('employeeId', selectedEmployee.id);
    }
  }, [selectedEmployee, setValue]);

  const onFormSubmit = async (data: CreateClaimRequest) => {
    try {
      await createClaim(data);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Error is handled by useCreateClaim hook
      console.error('Failed to create claim:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Claim</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-1">
              Employee Name *
            </label>
            <EmployeeNameAutocomplete
              id="employeeName"
              value={employeeName}
              onChange={setEmployeeName}
              onSelect={setSelectedEmployee}
              placeholder="Search and select employee..."
            />
            {errors.employeeId && (
              <p className="mt-1 text-sm text-red-600">{errors.employeeId.message}</p>
            )}
            {!selectedEmployee && watchedEmployeeId && (
              <p className="mt-1 text-sm text-red-600">Please select an employee from the suggestions</p>
            )}
          </div>

          <div>
            <label htmlFor="eventTypeId" className="block text-sm font-medium text-gray-700 mb-1">
              Event *
            </label>
            <select
              id="eventTypeId"
              {...register('eventTypeId')}
              className={`flex h-10 w-full rounded-md border ${
                errors.eventTypeId ? 'border-red-500' : 'border-input'
              } bg-background px-3 py-2 text-sm`}
              disabled={configLoading}
            >
              <option value="">Select Event</option>
              {config?.eventTypes
                .filter((et) => et.isActive)
                .map((eventType) => (
                  <option key={eventType.id} value={eventType.id}>
                    {eventType.name}
                  </option>
                ))}
            </select>
            {errors.eventTypeId && (
              <p className="mt-1 text-sm text-red-600">{errors.eventTypeId.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="currencyId" className="block text-sm font-medium text-gray-700 mb-1">
              Currency *
            </label>
            <select
              id="currencyId"
              {...register('currencyId')}
              className={`flex h-10 w-full rounded-md border ${
                errors.currencyId ? 'border-red-500' : 'border-input'
              } bg-background px-3 py-2 text-sm`}
              disabled={configLoading}
            >
              <option value="">Select Currency</option>
              {config?.currencies
                .filter((c) => c.isActive)
                .map((currency) => (
                  <option key={currency.id} value={currency.id}>
                    {currency.code} - {currency.name} ({currency.symbol})
                  </option>
                ))}
            </select>
            {errors.currencyId && (
              <p className="mt-1 text-sm text-red-600">{errors.currencyId.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              id="remarks"
              {...register('remarks')}
              rows={4}
              className={`flex w-full rounded-md border ${
                errors.remarks ? 'border-red-500' : 'border-input'
              } bg-background px-3 py-2 text-sm`}
              placeholder="Optional remarks..."
            />
            {errors.remarks && (
              <p className="mt-1 text-sm text-red-600">{errors.remarks.message}</p>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading || configLoading}>
            {loading ? 'Creating...' : 'Create Claim'}
          </Button>
        </div>
      </div>
    </form>
  );
};

