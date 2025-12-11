import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useClaimsConfig } from '../hooks/useClaimsConfig';
import type { CreateExpenseRequest } from '../types/expenses.types';

const expenseSchema = z.object({
  expenseTypeId: z.string().min(1, 'Expense type is required'),
  expenseDate: z.string().min(1, 'Expense date is required'),
  amount: z.number().positive('Amount must be greater than zero').max(999999.99, 'Amount is too large'),
  note: z.string().optional(),
}).refine(
  (data) => {
    const decimalPlaces = (data.amount.toString().split('.')[1] || '').length;
    return decimalPlaces <= 2;
  },
  {
    message: 'Amount cannot have more than 2 decimal places',
    path: ['amount'],
  }
).refine(
  (data) => {
    const expenseDate = new Date(data.expenseDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expenseDate.setHours(0, 0, 0, 0);
    return expenseDate <= today;
  },
  {
    message: 'Expense date cannot be in the future',
    path: ['expenseDate'],
  }
);

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExpenseRequest) => Promise<void>;
  loading?: boolean;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const { config } = useClaimsConfig();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateExpenseRequest>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      expenseTypeId: '',
      expenseDate: new Date().toISOString().split('T')[0],
      amount: 0,
      note: '',
    },
  });

  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onFormSubmit = async (data: CreateExpenseRequest) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (err) {
      // Error handling is done by parent component
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">Add Expense</h3>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="expenseTypeId" className="block text-sm font-medium text-gray-700 mb-1">
              Expense Type *
            </label>
            <select
              id="expenseTypeId"
              {...register('expenseTypeId')}
              className={`flex h-10 w-full rounded-md border ${
                errors.expenseTypeId ? 'border-red-500' : 'border-input'
              } bg-background px-3 py-2 text-sm`}
            >
              <option value="">Select Expense Type</option>
              {config?.expenseTypes
                .filter((et) => et.isActive)
                .map((expenseType) => (
                  <option key={expenseType.id} value={expenseType.id}>
                    {expenseType.name}
                  </option>
                ))}
            </select>
            {errors.expenseTypeId && (
              <p className="mt-1 text-sm text-red-600">{errors.expenseTypeId.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-700 mb-1">
              Expense Date *
            </label>
            <Input
              id="expenseDate"
              type="date"
              {...register('expenseDate')}
              className={errors.expenseDate ? 'border-red-500' : ''}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.expenseDate && (
              <p className="mt-1 text-sm text-red-600">{errors.expenseDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              max="999999.99"
              {...register('amount', { valueAsNumber: true })}
              className={errors.amount ? 'border-red-500' : ''}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
              Note
            </label>
            <textarea
              id="note"
              {...register('note')}
              rows={3}
              className={`flex w-full rounded-md border ${
                errors.note ? 'border-red-500' : 'border-input'
              } bg-background px-3 py-2 text-sm`}
              placeholder="Optional note..."
            />
            {errors.note && (
              <p className="mt-1 text-sm text-red-600">{errors.note.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

