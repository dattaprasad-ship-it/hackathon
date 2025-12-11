import { RateLimitService, RateLimitStatus } from '../rate-limit.service';
import { LoginAttemptRepository } from '../../repositories/login-attempt.repository';
import { LoginAttempt } from '../../entities/login-attempt.entity';
import { when } from 'jest-when';

describe('RateLimitService', () => {
  let rateLimitService: RateLimitService;
  let mockLoginAttemptRepository: jest.Mocked<LoginAttemptRepository>;

  beforeEach(() => {
    mockLoginAttemptRepository = {
      findRecentAttemptsByIp: jest.fn(),
      findRecentAttemptsByUsername: jest.fn(),
      createAttempt: jest.fn(),
    } as any;

    rateLimitService = new RateLimitService(mockLoginAttemptRepository);
  });

  describe('checkRateLimitByIp', () => {
    it('should allow request when attempts are below limit', async () => {
      const ipAddress = '192.168.1.1';
      const maxAttempts = 5;
      const windowMinutes = 15;

      const mockAttempts: LoginAttempt[] = [
        {
          id: '1',
          username: 'user1',
          ipAddress,
          success: false,
          attemptTimestamp: new Date(Date.now() - 5 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as LoginAttempt,
      ];

      when(mockLoginAttemptRepository.findRecentAttemptsByIp)
        .calledWith(ipAddress, expect.any(Date))
        .mockResolvedValue(mockAttempts);

      const result = await rateLimitService.checkRateLimitByIp(
        ipAddress,
        maxAttempts,
        windowMinutes
      );

      expect(result.allowed).toBe(true);
      expect(result.attemptsRemaining).toBe(4);
      expect(result.retryAfter).toBeUndefined();
    });

    it('should reject request when attempts exceed limit', async () => {
      const ipAddress = '192.168.1.1';
      const maxAttempts = 5;
      const windowMinutes = 15;

      const mockAttempts: LoginAttempt[] = Array.from({ length: 5 }, (_, i) => ({
        id: `${i}`,
        username: 'user1',
        ipAddress,
        success: false,
        attemptTimestamp: new Date(Date.now() - (5 - i) * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      })) as LoginAttempt[];

      when(mockLoginAttemptRepository.findRecentAttemptsByIp)
        .calledWith(ipAddress, expect.any(Date))
        .mockResolvedValue(mockAttempts);

      const result = await rateLimitService.checkRateLimitByIp(
        ipAddress,
        maxAttempts,
        windowMinutes
      );

      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeInstanceOf(Date);
      expect(result.attemptsRemaining).toBeUndefined();
    });

    it('should calculate retryAfter based on oldest attempt', async () => {
      const ipAddress = '192.168.1.1';
      const maxAttempts = 5;
      const windowMinutes = 15;

      const oldestTimestamp = new Date(Date.now() - 10 * 60 * 1000);
      const mockAttempts: LoginAttempt[] = Array.from({ length: 5 }, (_, i) => ({
        id: `${i}`,
        username: 'user1',
        ipAddress,
        success: false,
        attemptTimestamp: new Date(oldestTimestamp.getTime() + i * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      })) as LoginAttempt[];

      when(mockLoginAttemptRepository.findRecentAttemptsByIp)
        .calledWith(ipAddress, expect.any(Date))
        .mockResolvedValue(mockAttempts);

      const result = await rateLimitService.checkRateLimitByIp(
        ipAddress,
        maxAttempts,
        windowMinutes
      );

      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeInstanceOf(Date);
      expect(result.retryAfter!.getTime()).toBeGreaterThan(oldestTimestamp.getTime());
    });
  });

  describe('checkRateLimitByUsername', () => {
    it('should allow request when attempts are below limit', async () => {
      const username = 'testuser';
      const maxAttempts = 10;
      const windowMinutes = 60;

      const mockAttempts: LoginAttempt[] = [
        {
          id: '1',
          username,
          ipAddress: '192.168.1.1',
          success: false,
          attemptTimestamp: new Date(Date.now() - 30 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as LoginAttempt,
      ];

      when(mockLoginAttemptRepository.findRecentAttemptsByUsername)
        .calledWith(username, expect.any(Date))
        .mockResolvedValue(mockAttempts);

      const result = await rateLimitService.checkRateLimitByUsername(
        username,
        maxAttempts,
        windowMinutes
      );

      expect(result.allowed).toBe(true);
      expect(result.attemptsRemaining).toBe(9);
    });

    it('should reject request when attempts exceed limit', async () => {
      const username = 'testuser';
      const maxAttempts = 10;
      const windowMinutes = 60;

      const mockAttempts: LoginAttempt[] = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        username,
        ipAddress: '192.168.1.1',
        success: false,
        attemptTimestamp: new Date(Date.now() - (30 - i) * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      })) as LoginAttempt[];

      when(mockLoginAttemptRepository.findRecentAttemptsByUsername)
        .calledWith(username, expect.any(Date))
        .mockResolvedValue(mockAttempts);

      const result = await rateLimitService.checkRateLimitByUsername(
        username,
        maxAttempts,
        windowMinutes
      );

      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeInstanceOf(Date);
    });
  });

  describe('recordAttempt', () => {
    it('should record a login attempt', async () => {
      const attempt = {
        username: 'testuser',
        ipAddress: '192.168.1.1',
        success: true,
        attemptTimestamp: new Date(),
      };

      const mockAttempt: LoginAttempt = {
        id: '1',
        ...attempt,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as LoginAttempt;

      when(mockLoginAttemptRepository.createAttempt)
        .calledWith(attempt)
        .mockResolvedValue(mockAttempt);

      await rateLimitService.recordAttempt(attempt);

      expect(mockLoginAttemptRepository.createAttempt).toHaveBeenCalledWith(attempt);
    });

    it('should record failed attempt with failure reason', async () => {
      const attempt = {
        username: 'testuser',
        ipAddress: '192.168.1.1',
        success: false,
        failureReason: 'Invalid password',
        attemptTimestamp: new Date(),
      };

      const mockAttempt: LoginAttempt = {
        id: '1',
        ...attempt,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as LoginAttempt;

      when(mockLoginAttemptRepository.createAttempt)
        .calledWith(attempt)
        .mockResolvedValue(mockAttempt);

      await rateLimitService.recordAttempt(attempt);

      expect(mockLoginAttemptRepository.createAttempt).toHaveBeenCalledWith(attempt);
    });
  });
});

