"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentRepository = void 0;
const IGenericRepository_1 = require("../../../common/base/IGenericRepository");
class AttachmentRepository extends IGenericRepository_1.IGenericRepository {
    constructor(repository) {
        super(repository);
    }
    async findByClaimId(claimId) {
        return this.repository.find({
            where: { claim: { id: claimId } },
            order: { createdAt: 'DESC' },
        });
    }
    async findByStoredFilename(storedFilename) {
        return this.repository.findOne({
            where: { storedFilename },
            relations: ['claim'],
        });
    }
}
exports.AttachmentRepository = AttachmentRepository;
//# sourceMappingURL=attachment.repository.js.map