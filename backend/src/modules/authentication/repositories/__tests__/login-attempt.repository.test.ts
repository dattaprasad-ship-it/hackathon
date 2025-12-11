import { Repository, MoreThanOrEqual } from 'typeorm';
import { LoginAttemptRepository } from '../login-attempt.repository';
import { LoginAttempt } from '../../entities/login-attempt.entity';
import { when } from 'jest-when';

describe('LoginAttemptRepository', () => {
  let loginAttemptRepository: LoginAttemptRepository;
  let mockRepository: jest.Mocked<Repository<LoginAttempt>>;

  beforeEach(() => {
    mockRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as any;

    loginAttemptRepository = new LoginAttemptRepository(mockRepository);
  });

  describe('createAttempt', () => {
    it('should create a new login attempt', async () => {
      const attemptData = {
        username: 'testuser',
        ipAddress: '192.168.1.1',
        success: true,
        attemptTimestamp: new Date(),
      };

      const mockAttempt: LoginAttempt = {
        id: '1',
        ...attemptData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as LoginAttempt;

      when(mockRepository.create).calledWith(attemptData).mockReturnValue(mockAttempt);
      when(mockRepository.save).calledWith(mockAttempt).mockResolvedValue(mockAttempt);

      const result = await loginAttemptRepository.createAttempt(attemptData);

      expect(result).toEqual(mockAttempt);
      expect(mockRepository.create).toHaveBeenCalledWith(attemptData);
      expect(mockRepository.save).toHaveBeenCalledWith(mockAttempt);
    });

    it('should create a failed attempt with failure reason', async () => {
      const attemptData = {
        username: 'testuser',
        ipAddress: '192.168.1.1',
        success: false,
        failureReason: 'Invalid password',
        attemptTimestamp: new Date(),
      };

      const mockAttempt: LoginAttempt = {
        id: '1',
        ...attemptData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as LoginAttempt;

      when(mockRepository.create).calledWith(attemptData).mockReturnValue(mockAttempt);
      when(mockRepository.save).calledWith(mockAttempt).mockResolvedValue(mockAttempt);

      const result = await loginAttemptRepository.createAttempt(attemptData);

      expect(result).toEqual(mockAttempt);
      expect(result.failureReason).toBe('Invalid password');
    });
  });

  describe('findRecentAttemptsByIp', () => {
    it('should find recent attempts by IP address', async () => {
      const ipAddress = '192.168.1.1';
      const since = new Date(Date.now() - 15 * 60 * 1000);

      const mockAttempts: LoginAttempt[] = [
        {
          id: '1',
          username: 'user1',
          ipAddress,
          success: false,
          attemptTimestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as LoginAttempt,
      ];

      when(mockRepository.find)
        .calledWith({
          where: {
            ipAddress,
            attemptTimestamp: MoreThanOrEqual(since),
          },
          order: {
            attemptTimestamp: 'DESC',
          },
        })
        .mockResolvedValue(mockAttempts);

      const result = await loginAttemptRepository.findRecentAttemptsByIp(ipAddress, since);

      expect(result).toEqual(mockAttempts);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          ipAddress,
          attemptTimestamp: MoreThanOrEqual(since),
        },
        order: {
          attemptTimestamp: 'DESC',
        },
      });
    });
  });

  describe('findRecentAttemptsByUsername', () => {
    it('should find recent attempts by username', async () => {
      const username = 'testuser';
      const since = new Date(Date.now() - 60 * 60 * 1000);

      const mockAttempts: LoginAttempt[] = [
        {
          id: '1',
          username,
          ipAddress: '192.168.1.1',
          success: false,
          attemptTimestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as LoginAttempt,
      ];

      when(mockRepository.find)
        .calledWith({
          where: {
            username,
            attemptTimestamp: MoreThanOrEqual(since),
          },
          order: {
            attemptTimestamp: 'DESC',
          },
        })
        .mockResolvedValue(mockAttempts);

      const result = await loginAttemptRepository.findRecentAttemptsByUsername(
        username,
        since
      );

      expect(result).toEqual(mockAttempts);
    });
  });

  describe('countRecentAttemptsByIp', () => {
    it('should count recent attempts by IP address', async () => {
      const ipAddress = '192.168.1.1';
      const since = new Date(Date.now() - 15 * 60 * 1000);

      when(mockRepository.count)
        .calledWith({
          where: {
            ipAddress,
            attemptTimestamp: MoreThanOrEqual(since),
          },
        })
        .mockResolvedValue(5);

      const result = await loginAttemptRepository.countRecentAttemptsByIp(ipAddress, since);

      expect(result).toBe(5);
    });
  });

  describe('countRecentAttemptsByUsername', () => {
    it('should count recent attempts by username', async () => {
      const username = 'testuser';
      const since = new Date(Date.now() - 60 * 60 * 1000);

      when(mockRepository.count)
        .calledWith({
          where: {
            username,
            attemptTimestamp: MoreThanOrEqual(since),
          },
        })
        .mockResolvedValue(10);

      const result = await loginAttemptRepository.countRecentAttemptsByUsername(
        username,
        since
      );

      expect(result).toBe(10);
    });
  });
});

