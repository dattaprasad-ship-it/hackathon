import { Expense } from './claims.types';

export interface CreateExpenseRequest {
  expenseTypeId: string;
  expenseDate: string; // ISO date string (YYYY-MM-DD)
  amount: number;
  note?: string;
}

export interface UpdateExpenseRequest {
  expenseTypeId?: string;
  expenseDate?: string; // ISO date string (YYYY-MM-DD)
  amount?: number;
  note?: string;
}

export interface ExpenseResponse extends Expense {}

