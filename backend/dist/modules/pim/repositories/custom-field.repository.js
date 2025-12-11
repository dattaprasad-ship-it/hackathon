"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomFieldRepository = void 0;
const IGenericRepository_1 = require("../../../common/base/IGenericRepository");
class CustomFieldRepository extends IGenericRepository_1.IGenericRepository {
    constructor(repository) {
        super(repository);
    }
    async findByFieldName(fieldName) {
        return this.repository.findOne({
            where: {
                fieldName,
                isDeleted: false,
            },
        });
    }
    async findActiveFields() {
        return this.repository.find({
            where: { isDeleted: false },
            order: { fieldName: 'ASC' },
        });
    }
    async countActiveFields() {
        return this.repository.count({
            where: { isDeleted: false },
        });
    }
    async findByScreen(screen) {
        return this.repository.find({
            where: {
                screen,
                isDeleted: false,
            },
            order: { fieldName: 'ASC' },
        });
    }
    async softDelete(id, updatedBy) {
        await this.repository.update(id, { isDeleted: true, updatedBy });
    }
}
exports.CustomFieldRepository = CustomFieldRepository;
//# sourceMappingURL=custom-field.repository.js.map