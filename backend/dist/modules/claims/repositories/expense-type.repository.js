"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseTypeRepository = void 0;
const IGenericRepository_1 = require("../../../common/base/IGenericRepository");
class ExpenseTypeRepository extends IGenericRepository_1.IGenericRepository {
    constructor(repository) {
        super(repository);
    }
    async findActive() {
        return this.repository.find({
            where: { isActive: true },
            order: { name: 'ASC' },
        });
    }
    async findByName(name) {
        return this.repository.findOne({
            where: { name },
        });
    }
}
exports.ExpenseTypeRepository = ExpenseTypeRepository;
//# sourceMappingURL=expense-type.repository.js.map