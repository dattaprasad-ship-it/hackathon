import { AuthenticationService } from '../authentication.service';
import { UserRepository } from '../../repositories/user.repository';
import { LoginAttemptRepository } from '../../repositories/login-attempt.repository';
import { RateLimitService } from '../rate-limit.service';
import { passwordUtil } from '../../utils/password.util';
import { jwtUtil } from '../../utils/jwt.util';
import { User } from '../../entities/user.entity';
import { UserRole } from '../../../../constants/enums/user-role.enum';
import { AccountStatus } from '../../../../constants/enums/account-status.enum';
import { when } from 'jest-when';

jest.mock('../../utils/password.util');
jest.mock('../../utils/jwt.util');

describe('AuthenticationService Edge Cases', () => {
  let authenticationService: AuthenticationService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockLoginAttemptRepository: jest.Mocked<LoginAttemptRepository>;
  let mockRateLimitService: jest.Mocked<RateLimitService>;

  beforeEach(() => {
    mockUserRepository = {
      findByUsername: jest.fn(),
      updateLastLogin: jest.fn(),
      findById: jest.fn(),
    } as any;

    mockLoginAttemptRepository = {
      createAttempt: jest.fn(),
    } as any;

    mockRateLimitService = {
      checkRateLimitByIp: jest.fn(),
      checkRateLimitByUsername: jest.fn(),
      recordAttempt: jest.fn(),
    } as any;

    authenticationService = new AuthenticationService(
      mockUserRepository,
      mockLoginAttemptRepository,
      mockRateLimitService
    );
  });

  describe('Database connection failures', () => {
    it('should handle database errors when finding user', async () => {
      when(mockRateLimitService.checkRateLimitByIp)
        .calledWith(expect.any(String), 5, 15)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 5 });

      when(mockRateLimitService.checkRateLimitByUsername)
        .calledWith(expect.any(String), 10, 60)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 10 });

      when(mockUserRepository.findByUsername)
        .calledWith(expect.any(String))
        .mockRejectedValue(new Error('Database connection failed'));

      await expect(
        authenticationService.login(
          { username: 'testuser', password: 'password123' },
          '192.168.1.1'
        )
      ).rejects.toThrow('Database connection failed');
    });
  });

  describe('Password hashing failures', () => {
    it('should handle password verification errors gracefully', async () => {
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        passwordHash: 'hashed_password',
        role: UserRole.ADMIN,
        accountStatus: AccountStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      when(mockRateLimitService.checkRateLimitByIp)
        .calledWith(expect.any(String), 5, 15)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 5 });

      when(mockRateLimitService.checkRateLimitByUsername)
        .calledWith(expect.any(String), 10, 60)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 10 });

      when(mockUserRepository.findByUsername)
        .calledWith(expect.any(String))
        .mockResolvedValue(mockUser);

      (passwordUtil.verifyPassword as jest.Mock).mockRejectedValue(
        new Error('Password verification failed')
      );

      await expect(
        authenticationService.login(
          { username: 'testuser', password: 'password123' },
          '192.168.1.1'
        )
      ).rejects.toThrow('Password verification failed');
    });
  });

  describe('Token generation failures', () => {
    it('should handle JWT token generation errors', async () => {
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        passwordHash: 'hashed_password',
        role: UserRole.ADMIN,
        accountStatus: AccountStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      when(mockRateLimitService.checkRateLimitByIp)
        .calledWith(expect.any(String), 5, 15)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 5 });

      when(mockRateLimitService.checkRateLimitByUsername)
        .calledWith(expect.any(String), 10, 60)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 10 });

      when(mockUserRepository.findByUsername)
        .calledWith(expect.any(String))
        .mockResolvedValue(mockUser);

      (passwordUtil.verifyPassword as jest.Mock).mockResolvedValue(true);
      (jwtUtil.generateToken as jest.Mock).mockImplementation(() => {
        throw new Error('Token generation failed');
      });

      await expect(
        authenticationService.login(
          { username: 'testuser', password: 'password123' },
          '192.168.1.1'
        )
      ).rejects.toThrow('Token generation failed');
    });
  });

  describe('Rate limiting storage failures', () => {
    it('should handle rate limit check failures gracefully', async () => {
      when(mockRateLimitService.checkRateLimitByIp)
        .calledWith(expect.any(String), 5, 15)
        .mockRejectedValue(new Error('Rate limit storage failed'));

      await expect(
        authenticationService.login(
          { username: 'testuser', password: 'password123' },
          '192.168.1.1'
        )
      ).rejects.toThrow('Rate limit storage failed');
    });
  });

  describe('Login attempt logging failures', () => {
    it('should continue authentication even if logging fails', async () => {
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        passwordHash: 'hashed_password',
        role: UserRole.ADMIN,
        accountStatus: AccountStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      when(mockRateLimitService.checkRateLimitByIp)
        .calledWith(expect.any(String), 5, 15)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 5 });

      when(mockRateLimitService.checkRateLimitByUsername)
        .calledWith(expect.any(String), 10, 60)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 10 });

      when(mockUserRepository.findByUsername)
        .calledWith(expect.any(String))
        .mockResolvedValue(mockUser);

      (passwordUtil.verifyPassword as jest.Mock).mockResolvedValue(true);
      (jwtUtil.generateToken as jest.Mock).mockReturnValue('token');

      when(mockUserRepository.updateLastLogin)
        .calledWith(expect.any(String), expect.any(Date))
        .mockResolvedValue(undefined);

      when(mockRateLimitService.recordAttempt)
        .calledWith(expect.any(Object))
        .mockRejectedValue(new Error('Logging failed'));

      const result = await authenticationService.login(
        { username: 'testuser', password: 'password123' },
        '192.168.1.1'
      );

      expect(result.token).toBe('token');
    });
  });

  describe('Empty or missing credentials', () => {
    it('should reject empty username', async () => {
      await expect(
        authenticationService.login({ username: '', password: 'password123' }, '192.168.1.1')
      ).rejects.toMatchObject({
        message: 'Username and password cannot be empty',
        statusCode: 400,
      });
    });

    it('should reject empty password', async () => {
      await expect(
        authenticationService.login({ username: 'testuser', password: '' }, '192.168.1.1')
      ).rejects.toMatchObject({
        message: 'Username and password cannot be empty',
        statusCode: 400,
      });
    });

    it('should reject whitespace-only credentials', async () => {
      await expect(
        authenticationService.login(
          { username: '   ', password: '   ' },
          '192.168.1.1'
        )
      ).rejects.toMatchObject({
        message: 'Username and password cannot be empty',
        statusCode: 400,
      });
    });
  });
});

