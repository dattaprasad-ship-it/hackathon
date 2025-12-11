import { apiClient } from '@/utils/api';
import type {
  CreateExpenseRequest,
  UpdateExpenseRequest,
  ExpenseResponse,
} from '../types/expenses.types';

export const expensesService = {
  getByClaimId: async (claimId: string): Promise<ExpenseResponse[]> => {
    const response = await apiClient.get<ExpenseResponse[]>(`/claims/${claimId}/expenses`);
    return response.data;
  },

  create: async (claimId: string, data: CreateExpenseRequest): Promise<ExpenseResponse> => {
    const response = await apiClient.post<ExpenseResponse>(`/claims/${claimId}/expenses`, data);
    return response.data;
  },

  update: async (claimId: string, expenseId: string, data: UpdateExpenseRequest): Promise<void> => {
    await apiClient.put(`/claims/${claimId}/expenses/${expenseId}`, data);
  },

  delete: async (claimId: string, expenseId: string): Promise<void> => {
    await apiClient.delete(`/claims/${claimId}/expenses/${expenseId}`);
  },
};

