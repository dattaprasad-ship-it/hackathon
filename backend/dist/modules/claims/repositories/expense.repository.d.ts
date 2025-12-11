import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { Expense } from '../entities/expense.entity';
export declare class ExpenseRepository extends IGenericRepository<Expense> {
    constructor(repository: Repository<Expense>);
    findByClaimId(claimId: string): Promise<Expense[]>;
    calculateTotalAmount(claimId: string): Promise<number>;
}
//# sourceMappingURL=expense.repository.d.ts.map