"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const IGenericRepository_1 = require("../../../common/base/IGenericRepository");
class UserRepository extends IGenericRepository_1.IGenericRepository {
    constructor(repository) {
        super(repository);
    }
    async findByUsername(username) {
        // SQLite doesn't support ILike, use exact match for username
        return this.repository.findOne({
            where: {
                username: username,
            },
        });
    }
    async updateLastLogin(userId, lastLoginAt) {
        await this.repository.update(userId, { lastLoginAt });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map