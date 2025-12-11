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

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockLoginAttemptRepository: jest.Mocked<LoginAttemptRepository>;
  let mockRateLimitService: jest.Mocked<RateLimitService>;

  beforeEach(() => {
    mockUserRepository = {
      findByUsername: jest.fn(),
      updateLastLogin: jest.fn(),
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

  describe('login', () => {
    const credentials = {
      username: 'testuser',
      password: 'password123',
    };
    const ipAddress = '192.168.1.1';

    it('should successfully authenticate user with valid credentials', async () => {
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        passwordHash: 'hashed_password',
        role: UserRole.ADMIN,
        accountStatus: AccountStatus.ACTIVE,
        displayName: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      when(mockRateLimitService.checkRateLimitByIp)
        .calledWith(ipAddress, 5, 15)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 5 });

      when(mockRateLimitService.checkRateLimitByUsername)
        .calledWith('testuser', 10, 60)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 10 });

      when(mockUserRepository.findByUsername).calledWith('testuser').mockResolvedValue(mockUser);

      (passwordUtil.verifyPassword as jest.Mock).mockResolvedValue(true);
      (jwtUtil.generateToken as jest.Mock).mockReturnValue('jwt_token');

      when(mockUserRepository.updateLastLogin)
        .calledWith('1', expect.any(Date))
        .mockResolvedValue(undefined);

      when(mockRateLimitService.recordAttempt)
        .calledWith({
          username: 'testuser',
          ipAddress,
          success: true,
          attemptTimestamp: expect.any(Date),
        })
        .mockResolvedValue(undefined);

      const result = await authenticationService.login(credentials, ipAddress);

      expect(result.token).toBe('jwt_token');
      expect(result.user.id).toBe('1');
      expect(result.user.username).toBe('testuser');
      expect(result.user.role).toBe(UserRole.ADMIN);
      expect(result.user.displayName).toBe('Test User');
    });

    it('should reject login when IP rate limit is exceeded', async () => {
      const retryAfter = new Date(Date.now() + 15 * 60 * 1000);

      when(mockRateLimitService.checkRateLimitByIp)
        .calledWith(ipAddress, 5, 15)
        .mockResolvedValue({ allowed: false, retryAfter });

      when(mockRateLimitService.recordAttempt)
        .calledWith({
          username: 'testuser',
          ipAddress,
          success: false,
          failureReason: 'Rate limit exceeded (IP)',
          attemptTimestamp: expect.any(Date),
        })
        .mockResolvedValue(undefined);

      await expect(
        authenticationService.login(credentials, ipAddress)
      ).rejects.toMatchObject({
        message: 'Too many login attempts. Please try again later.',
        statusCode: 429,
        retryAfter,
      });
    });

    it('should reject login when username rate limit is exceeded', async () => {
      const retryAfter = new Date(Date.now() + 60 * 60 * 1000);

      when(mockRateLimitService.checkRateLimitByIp)
        .calledWith(ipAddress, 5, 15)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 5 });

      when(mockRateLimitService.checkRateLimitByUsername)
        .calledWith('testuser', 10, 60)
        .mockResolvedValue({ allowed: false, retryAfter });

      when(mockRateLimitService.recordAttempt)
        .calledWith({
          username: 'testuser',
          ipAddress,
          success: false,
          failureReason: 'Rate limit exceeded (username)',
          attemptTimestamp: expect.any(Date),
        })
        .mockResolvedValue(undefined);

      await expect(
        authenticationService.login(credentials, ipAddress)
      ).rejects.toMatchObject({
        message: 'Too many login attempts. Please try again later.',
        statusCode: 429,
        retryAfter,
      });
    });

    it('should reject login with invalid username', async () => {
      when(mockRateLimitService.checkRateLimitByIp)
        .calledWith(ipAddress, 5, 15)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 5 });

      when(mockRateLimitService.checkRateLimitByUsername)
        .calledWith('testuser', 10, 60)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 10 });

      when(mockUserRepository.findByUsername).calledWith('testuser').mockResolvedValue(null);

      (passwordUtil.verifyPassword as jest.Mock).mockResolvedValue(false);

      when(mockRateLimitService.recordAttempt)
        .calledWith({
          username: 'testuser',
          ipAddress,
          success: false,
          failureReason: 'Invalid credentials',
          attemptTimestamp: expect.any(Date),
        })
        .mockResolvedValue(undefined);

      await expect(
        authenticationService.login(credentials, ipAddress)
      ).rejects.toMatchObject({
        message: 'Invalid username or password',
        statusCode: 401,
      });

      expect(passwordUtil.verifyPassword).toHaveBeenCalledWith(
        'password123',
        '$2b$10$dummyhash'
      );
    });

    it('should reject login with invalid password', async () => {
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
        .calledWith(ipAddress, 5, 15)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 5 });

      when(mockRateLimitService.checkRateLimitByUsername)
        .calledWith('testuser', 10, 60)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 10 });

      when(mockUserRepository.findByUsername).calledWith('testuser').mockResolvedValue(mockUser);

      (passwordUtil.verifyPassword as jest.Mock).mockResolvedValue(false);

      when(mockRateLimitService.recordAttempt)
        .calledWith({
          username: 'testuser',
          ipAddress,
          success: false,
          failureReason: 'Invalid credentials',
          attemptTimestamp: expect.any(Date),
        })
        .mockResolvedValue(undefined);

      await expect(
        authenticationService.login(credentials, ipAddress)
      ).rejects.toMatchObject({
        message: 'Invalid username or password',
        statusCode: 401,
      });
    });

    it('should reject login for blocked account', async () => {
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        passwordHash: 'hashed_password',
        role: UserRole.ADMIN,
        accountStatus: AccountStatus.BLOCKED,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      when(mockRateLimitService.checkRateLimitByIp)
        .calledWith(ipAddress, 5, 15)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 5 });

      when(mockRateLimitService.checkRateLimitByUsername)
        .calledWith('testuser', 10, 60)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 10 });

      when(mockUserRepository.findByUsername).calledWith('testuser').mockResolvedValue(mockUser);

      (passwordUtil.verifyPassword as jest.Mock).mockResolvedValue(true);

      when(mockRateLimitService.recordAttempt)
        .calledWith({
          username: 'testuser',
          ipAddress,
          success: false,
          failureReason: 'account blocked',
          attemptTimestamp: expect.any(Date),
        })
        .mockResolvedValue(undefined);

      await expect(
        authenticationService.login(credentials, ipAddress)
      ).rejects.toMatchObject({
        message: 'Account is blocked. Please contact administrator.',
        statusCode: 403,
      });
    });

    it('should reject login for suspended account', async () => {
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        passwordHash: 'hashed_password',
        role: UserRole.ADMIN,
        accountStatus: AccountStatus.SUSPENDED,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      when(mockRateLimitService.checkRateLimitByIp)
        .calledWith(ipAddress, 5, 15)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 5 });

      when(mockRateLimitService.checkRateLimitByUsername)
        .calledWith('testuser', 10, 60)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 10 });

      when(mockUserRepository.findByUsername).calledWith('testuser').mockResolvedValue(mockUser);

      (passwordUtil.verifyPassword as jest.Mock).mockResolvedValue(true);

      when(mockRateLimitService.recordAttempt)
        .calledWith({
          username: 'testuser',
          ipAddress,
          success: false,
          failureReason: 'account suspended',
          attemptTimestamp: expect.any(Date),
        })
        .mockResolvedValue(undefined);

      await expect(
        authenticationService.login(credentials, ipAddress)
      ).rejects.toMatchObject({
        message: 'Account is suspended. Please contact administrator.',
        statusCode: 403,
      });
    });

    it('should trim whitespace from username and password', async () => {
      const credentialsWithWhitespace = {
        username: '  testuser  ',
        password: '  password123  ',
      };

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
        .calledWith(ipAddress, 5, 15)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 5 });

      when(mockRateLimitService.checkRateLimitByUsername)
        .calledWith('testuser', 10, 60)
        .mockResolvedValue({ allowed: true, attemptsRemaining: 10 });

      when(mockUserRepository.findByUsername).calledWith('testuser').mockResolvedValue(mockUser);

      (passwordUtil.verifyPassword as jest.Mock).mockResolvedValue(true);
      (jwtUtil.generateToken as jest.Mock).mockReturnValue('jwt_token');

      when(mockUserRepository.updateLastLogin)
        .calledWith('1', expect.any(Date))
        .mockResolvedValue(undefined);

      when(mockRateLimitService.recordAttempt)
        .calledWith({
          username: 'testuser',
          ipAddress,
          success: true,
          attemptTimestamp: expect.any(Date),
        })
        .mockResolvedValue(undefined);

      const result = await authenticationService.login(
        credentialsWithWhitespace,
        ipAddress
      );

      expect(result.token).toBe('jwt_token');
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('testuser');
    });
  });
});

