import { LoginAttemptRepository } from '../repositories/login-attempt.repository';
export interface RateLimitStatus {
    allowed: boolean;
    retryAfter?: Date;
    attemptsRemaining?: number;
}
export declare class RateLimitService {
    private readonly loginAttemptRepository;
    constructor(loginAttemptRepository: LoginAttemptRepository);
    checkRateLimitByIp(ipAddress: string, maxAttempts: number, windowMinutes: number): Promise<RateLimitStatus>;
    checkRateLimitByUsername(username: string, maxAttempts: number, windowMinutes: number): Promise<RateLimitStatus>;
    recordAttempt(attempt: {
        username: string;
        ipAddress: string;
        success: boolean;
        failureReason?: string;
        attemptTimestamp: Date;
    }): Promise<void>;
}
//# sourceMappingURL=rate-limit.service.d.ts.map