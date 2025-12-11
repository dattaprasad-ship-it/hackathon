"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginAttemptRepository = void 0;
const typeorm_1 = require("typeorm");
const IGenericRepository_1 = require("../../../common/base/IGenericRepository");
class LoginAttemptRepository extends IGenericRepository_1.IGenericRepository {
    constructor(repository) {
        super(repository);
    }
    async createAttempt(attempt) {
        const newAttempt = this.repository.create(attempt);
        return this.repository.save(newAttempt);
    }
    async findRecentAttemptsByIp(ipAddress, since) {
        return this.repository.find({
            where: {
                ipAddress,
                attemptTimestamp: (0, typeorm_1.MoreThanOrEqual)(since),
            },
            order: {
                attemptTimestamp: 'DESC',
            },
        });
    }
    async findRecentAttemptsByUsername(username, since) {
        return this.repository.find({
            where: {
                username,
                attemptTimestamp: (0, typeorm_1.MoreThanOrEqual)(since),
            },
            order: {
                attemptTimestamp: 'DESC',
            },
        });
    }
    async countRecentAttemptsByIp(ipAddress, since) {
        return this.repository.count({
            where: {
                ipAddress,
                attemptTimestamp: (0, typeorm_1.MoreThanOrEqual)(since),
            },
        });
    }
    async countRecentAttemptsByUsername(username, since) {
        return this.repository.count({
            where: {
                username,
                attemptTimestamp: (0, typeorm_1.MoreThanOrEqual)(since),
            },
        });
    }
}
exports.LoginAttemptRepository = LoginAttemptRepository;
//# sourceMappingURL=login-attempt.repository.js.map