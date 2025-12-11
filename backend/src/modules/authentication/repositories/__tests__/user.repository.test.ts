import { Repository, ILike } from 'typeorm';
import { UserRepository } from '../user.repository';
import { User } from '../../entities/user.entity';
import { UserRole } from '../../../../constants/enums/user-role.enum';
import { AccountStatus } from '../../../../constants/enums/account-status.enum';
import { when } from 'jest-when';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockRepository: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    mockRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    userRepository = new UserRepository(mockRepository);
  });

  describe('findByUsername', () => {
    it('should find user by username (case-insensitive)', async () => {
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        passwordHash: 'hashed',
        role: UserRole.ADMIN,
        accountStatus: AccountStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      when(mockRepository.findOne)
        .calledWith({
          where: {
            username: ILike('testuser'),
          },
        })
        .mockResolvedValue(mockUser);

      const result = await userRepository.findByUsername('testuser');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          username: ILike('testuser'),
        },
      });
    });

    it('should find user with different case', async () => {
      const mockUser: User = {
        id: '1',
        username: 'TestUser',
        passwordHash: 'hashed',
        role: UserRole.ADMIN,
        accountStatus: AccountStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      when(mockRepository.findOne)
        .calledWith({
          where: {
            username: ILike('testuser'),
          },
        })
        .mockResolvedValue(mockUser);

      const result = await userRepository.findByUsername('testuser');

      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      when(mockRepository.findOne)
        .calledWith({
          where: {
            username: ILike('nonexistent'),
          },
        })
        .mockResolvedValue(null);

      const result = await userRepository.findByUsername('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('updateLastLogin', () => {
    it('should update last login timestamp', async () => {
      const userId = '1';
      const lastLoginAt = new Date();

      when(mockRepository.update)
        .calledWith(userId, { lastLoginAt })
        .mockResolvedValue(undefined as any);

      await userRepository.updateLastLogin(userId, lastLoginAt);

      expect(mockRepository.update).toHaveBeenCalledWith(userId, { lastLoginAt });
    });
  });

  describe('inherited methods', () => {
    it('should find user by id', async () => {
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        passwordHash: 'hashed',
        role: UserRole.ADMIN,
        accountStatus: AccountStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      when(mockRepository.findOne)
        .calledWith({
          where: { id: '1' },
        })
        .mockResolvedValue(mockUser);

      const result = await userRepository.findById('1');

      expect(result).toEqual(mockUser);
    });
  });
});

