import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { ExpenseType } from '../entities/expense-type.entity';
export declare class ExpenseTypeRepository extends IGenericRepository<ExpenseType> {
    constructor(repository: Repository<ExpenseType>);
    findActive(): Promise<ExpenseType[]>;
    findByName(name: string): Promise<ExpenseType | null>;
}
//# sourceMappingURL=expense-type.repository.d.ts.map