import { Audit } from '../../../common/base/audit.entity';
import { Claim } from './claim.entity';
import { ExpenseType } from './expense-type.entity';
export declare class Expense extends Audit {
    claim: Claim;
    expenseType: ExpenseType;
    expenseDate: Date;
    amount: number;
    note?: string;
}
//# sourceMappingURL=expense.entity.d.ts.map