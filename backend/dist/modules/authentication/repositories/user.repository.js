"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const typeorm_1 = require("typeorm");
const IGenericRepository_1 = require("../../../common/base/IGenericRepository");
class UserRepository extends IGenericRepository_1.IGenericRepository {
    constructor(repository) {
        super(repository);
    }
    async findByUsername(username) {
        return this.repository.findOne({
            where: {
                username: (0, typeorm_1.ILike)(username),
            },
        });
    }
    async updateLastLogin(userId, lastLoginAt) {
        await this.repository.update(userId, { lastLoginAt });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map