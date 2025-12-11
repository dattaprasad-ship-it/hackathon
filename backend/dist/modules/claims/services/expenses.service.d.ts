import { ExpenseRepository } from '../repositories/expense.repository';
import { ClaimRepository } from '../repositories/claim.repository';
import { ExpenseTypeRepository } from '../repositories/expense-type.repository';
import { Expense } from '../entities/expense.entity';
import { CreateExpenseDto, UpdateExpenseDto } from '../dto/expenses.dto';
export declare class ExpensesService {
    private readonly expenseRepository;
    private readonly claimRepository;
    private readonly expenseTypeRepository;
    constructor(expenseRepository: ExpenseRepository, claimRepository: ClaimRepository, expenseTypeRepository: ExpenseTypeRepository);
    create(claimId: string, dto: CreateExpenseDto): Promise<Expense>;
    update(expenseId: string, dto: UpdateExpenseDto): Promise<void>;
    delete(expenseId: string): Promise<void>;
    findByClaimId(claimId: string): Promise<Expense[]>;
    private recalculateTotalAmount;
}
//# sourceMappingURL=expenses.service.d.ts.map