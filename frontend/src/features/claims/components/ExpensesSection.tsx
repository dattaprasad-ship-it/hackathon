import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useExpenses } from '../hooks/useExpenses';
import { useClaimDetail } from '../hooks/useClaimDetail';
import { AddExpenseModal } from './AddExpenseModal';
import type { CreateExpenseRequest } from '../types/expenses.types';

interface ExpensesSectionProps {
  claimId: string | null;
}

export const ExpensesSection: React.FC<ExpensesSectionProps> = ({ claimId }) => {
  const { claim } = useClaimDetail(claimId);
  const { expenses, loading, error, totalAmount, addExpense, updateExpense, deleteExpense } = useExpenses(claimId);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [adding, setAdding] = React.useState(false);

  const canModify = claim?.status === 'Initiated';

  const handleAddExpense = async (data: CreateExpenseRequest) => {
    if (!claimId) return;

    setAdding(true);
    try {
      await addExpense(data);
      setShowAddModal(false);
    } catch (err) {
      // Error is handled by useExpenses hook
      throw err;
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (expenseId: string) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await deleteExpense(expenseId);
    } catch (err) {
      console.error('Failed to delete expense:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  if (loading && !expenses.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Expenses</h2>
          {canModify && (
            <Button onClick={() => setShowAddModal(true)} size="sm" aria-label="Add expense">
              + Add Expense
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {expenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No expenses added yet
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expense Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Note
                    </th>
                    {canModify && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.expenseType.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(expense.expenseDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={expense.note}>
                        {expense.note || '-'}
                      </td>
                      {canModify && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="text-red-600 hover:text-red-900"
                            aria-label={`Delete expense ${expense.expenseType.name}`}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-end">
                <p className="text-lg font-semibold text-gray-900">
                  Total Amount: {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <AddExpenseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddExpense}
        loading={adding}
      />
    </>
  );
};
