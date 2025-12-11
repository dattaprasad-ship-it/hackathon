"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitService = void 0;
class RateLimitService {
    constructor(loginAttemptRepository) {
        this.loginAttemptRepository = loginAttemptRepository;
    }
    async checkRateLimitByIp(ipAddress, maxAttempts, windowMinutes) {
        const since = new Date(Date.now() - windowMinutes * 60 * 1000);
        const attempts = await this.loginAttemptRepository.findRecentAttemptsByIp(ipAddress, since);
        if (attempts.length >= maxAttempts) {
            const oldestAttempt = attempts[attempts.length - 1];
            const retryAfter = new Date(oldestAttempt.attemptTimestamp.getTime() + windowMinutes * 60 * 1000);
            return {
                allowed: false,
                retryAfter,
            };
        }
        return {
            allowed: true,
            attemptsRemaining: maxAttempts - attempts.length,
        };
    }
    async checkRateLimitByUsername(username, maxAttempts, windowMinutes) {
        const since = new Date(Date.now() - windowMinutes * 60 * 1000);
        const attempts = await this.loginAttemptRepository.findRecentAttemptsByUsername(username, since);
        if (attempts.length >= maxAttempts) {
            const oldestAttempt = attempts[attempts.length - 1];
            const retryAfter = new Date(oldestAttempt.attemptTimestamp.getTime() + windowMinutes * 60 * 1000);
            return {
                allowed: false,
                retryAfter,
            };
        }
        return {
            allowed: true,
            attemptsRemaining: maxAttempts - attempts.length,
        };
    }
    async recordAttempt(attempt) {
        await this.loginAttemptRepository.createAttempt(attempt);
    }
}
exports.RateLimitService = RateLimitService;
//# sourceMappingURL=rate-limit.service.js.map