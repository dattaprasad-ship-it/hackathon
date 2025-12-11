import { useState, useEffect, useCallback } from 'react';
import { expensesService } from '../services/expensesService';
import type { Expense, CreateExpenseRequest, UpdateExpenseRequest } from '../types/expenses.types';

export const useExpenses = (claimId: string | null) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await expensesService.getByClaimId(id);
      setExpenses(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to fetch expenses';
      setError(errorMessage);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (claimId) {
      fetchExpenses(claimId);
    } else {
      setExpenses([]);
      setError(null);
      setLoading(false);
    }
  }, [claimId, fetchExpenses]);

  const addExpense = useCallback(
    async (data: CreateExpenseRequest) => {
      if (!claimId) return;

      setLoading(true);
      setError(null);

      try {
        const expense = await expensesService.create(claimId, data);
        await fetchExpenses(claimId);
        return expense;
      } catch (err: any) {
        const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to add expense';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [claimId, fetchExpenses]
  );

  const updateExpense = useCallback(
    async (expenseId: string, data: UpdateExpenseRequest) => {
      if (!claimId) return;

      setLoading(true);
      setError(null);

      try {
        await expensesService.update(claimId, expenseId, data);
        await fetchExpenses(claimId);
      } catch (err: any) {
        const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to update expense';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [claimId, fetchExpenses]
  );

  const deleteExpense = useCallback(
    async (expenseId: string) => {
      if (!claimId) return;

      setLoading(true);
      setError(null);

      try {
        await expensesService.delete(claimId, expenseId);
        await fetchExpenses(claimId);
      } catch (err: any) {
        const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to delete expense';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [claimId, fetchExpenses]
  );

  const refresh = useCallback(() => {
    if (claimId) {
      fetchExpenses(claimId);
    }
  }, [claimId, fetchExpenses]);

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return {
    expenses,
    loading,
    error,
    totalAmount,
    addExpense,
    updateExpense,
    deleteExpense,
    refresh,
  };
};

