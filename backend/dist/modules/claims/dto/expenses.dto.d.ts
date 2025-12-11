export interface CreateExpenseDto {
    expenseTypeId: string;
    expenseDate: string;
    amount: number;
    note?: string;
}
export interface UpdateExpenseDto {
    expenseTypeId?: string;
    expenseDate?: string;
    amount?: number;
    note?: string;
}
export interface ExpenseResponseDto {
    id: string;
    expenseType: {
        id: string;
        name: string;
    };
    expenseDate: string;
    amount: number;
    note?: string;
    createdAt: string;
    updatedAt: string;
}
//# sourceMappingURL=expenses.dto.d.ts.map