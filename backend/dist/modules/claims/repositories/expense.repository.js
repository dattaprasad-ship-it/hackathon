"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseRepository = void 0;
const IGenericRepository_1 = require("../../../common/base/IGenericRepository");
class ExpenseRepository extends IGenericRepository_1.IGenericRepository {
    constructor(repository) {
        super(repository);
    }
    async findByClaimId(claimId) {
        return this.repository.find({
            where: { claim: { id: claimId } },
            relations: ['expenseType'],
            order: { expenseDate: 'DESC' },
        });
    }
    async calculateTotalAmount(claimId) {
        const result = await this.repository
            .createQueryBuilder('expense')
            .select('SUM(expense.amount)', 'total')
            .where('expense.claim.id = :claimId', { claimId })
            .getRawOne();
        return result?.total ? parseFloat(result.total) : 0;
    }
}
exports.ExpenseRepository = ExpenseRepository;
//# sourceMappingURL=expense.repository.js.map