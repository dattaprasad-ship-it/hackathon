"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyRepository = void 0;
const IGenericRepository_1 = require("../../../common/base/IGenericRepository");
class CurrencyRepository extends IGenericRepository_1.IGenericRepository {
    constructor(repository) {
        super(repository);
    }
    async findActive() {
        return this.repository.find({
            where: { isActive: true },
            order: { code: 'ASC' },
        });
    }
    async findByCode(code) {
        return this.repository.findOne({
            where: { code },
        });
    }
}
exports.CurrencyRepository = CurrencyRepository;
//# sourceMappingURL=currency.repository.js.map