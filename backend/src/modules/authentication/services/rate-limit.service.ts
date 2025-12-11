import { LoginAttemptRepository } from '../repositories/login-attempt.repository';

export interface RateLimitStatus {
  allowed: boolean;
  retryAfter?: Date;
  attemptsRemaining?: number;
}

export class RateLimitService {
  constructor(private readonly loginAttemptRepository: LoginAttemptRepository) {}

  async checkRateLimitByIp(
    ipAddress: string,
    maxAttempts: number,
    windowMinutes: number
  ): Promise<RateLimitStatus> {
    const since = new Date(Date.now() - windowMinutes * 60 * 1000);
    const attempts = await this.loginAttemptRepository.findRecentAttemptsByIp(
      ipAddress,
      since
    );

    if (attempts.length >= maxAttempts) {
      const oldestAttempt = attempts[attempts.length - 1];
      const retryAfter = new Date(
        oldestAttempt.attemptTimestamp.getTime() + windowMinutes * 60 * 1000
      );

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

  async checkRateLimitByUsername(
    username: string,
    maxAttempts: number,
    windowMinutes: number
  ): Promise<RateLimitStatus> {
    const since = new Date(Date.now() - windowMinutes * 60 * 1000);
    const attempts = await this.loginAttemptRepository.findRecentAttemptsByUsername(
      username,
      since
    );

    if (attempts.length >= maxAttempts) {
      const oldestAttempt = attempts[attempts.length - 1];
      const retryAfter = new Date(
        oldestAttempt.attemptTimestamp.getTime() + windowMinutes * 60 * 1000
      );

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

  async recordAttempt(attempt: {
    username: string;
    ipAddress: string;
    success: boolean;
    failureReason?: string;
    attemptTimestamp: Date;
  }): Promise<void> {
    await this.loginAttemptRepository.createAttempt(attempt);
  }
}

