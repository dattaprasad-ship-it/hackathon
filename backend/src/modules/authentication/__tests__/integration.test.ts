import request from 'supertest';
import express, { Express } from 'express';
import { createApp } from '../../../app';
import { createAuthenticationRoutes } from '../routes/authentication.routes';
import { AuthenticationService } from '../services/authentication.service';
import { UserRepository } from '../repositories/user.repository';
import { LoginAttemptRepository } from '../repositories/login-attempt.repository';
import { RateLimitService } from '../services/rate-limit.service';
import { AppDataSource } from '../../../config/database';
import { User } from '../entities/user.entity';
import { LoginAttempt } from '../entities/login-attempt.entity';
import { UserRole } from '../../../constants/enums/user-role.enum';
import { AccountStatus } from '../../../constants/enums/account-status.enum';
import { passwordUtil } from '../utils/password.util';
import { jwtUtil } from '../utils/jwt.util';

jest.mock('../../../config/database');

describe('Authentication Integration Tests', () => {
  let app: Express;
  let authenticationService: AuthenticationService;
  let userRepository: UserRepository;
  let loginAttemptRepository: LoginAttemptRepository;
  let rateLimitService: RateLimitService;

  beforeAll(async () => {
    app = createApp();

    const mockDataSource = {
      getRepository: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock) = mockDataSource.getRepository;

    const mockUserRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockLoginAttemptRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };

    mockDataSource.getRepository.mockImplementation((entity) => {
      if (entity === User) return mockUserRepo;
      if (entity === LoginAttempt) return mockLoginAttemptRepo;
      return {};
    });

    userRepository = new UserRepository(mockUserRepo as any);
    loginAttemptRepository = new LoginAttemptRepository(mockLoginAttemptRepo as any);
    rateLimitService = new RateLimitService(loginAttemptRepository);
    authenticationService = new AuthenticationService(
      userRepository,
      loginAttemptRepository,
      rateLimitService
    );

    const authRoutes = createAuthenticationRoutes(authenticationService, userRepository);
    app.use('/api/auth', authRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should successfully authenticate with valid credentials', async () => {
      const hashedPassword = await passwordUtil.hashPassword('password123');
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        passwordHash: hashedPassword,
        role: UserRole.ADMIN,
        accountStatus: AccountStatus.ACTIVE,
        displayName: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      const mockLoginAttemptRepo = AppDataSource.getRepository(LoginAttempt) as any;
      mockLoginAttemptRepo.find.mockResolvedValue([]);
      mockLoginAttemptRepo.create.mockImplementation((attempt) => ({
        ...attempt,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      mockLoginAttemptRepo.save.mockResolvedValue({});

      const mockUserRepo = AppDataSource.getRepository(User) as any;
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockUserRepo.update.mockResolvedValue({});

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe('testuser');
      expect(response.body.user.role).toBe(UserRole.ADMIN);
    });

    it('should reject login with invalid credentials', async () => {
      const mockLoginAttemptRepo = AppDataSource.getRepository(LoginAttempt) as any;
      mockLoginAttemptRepo.find.mockResolvedValue([]);
      mockLoginAttemptRepo.create.mockResolvedValue({});
      mockLoginAttemptRepo.save.mockResolvedValue({});

      const mockUserRepo = AppDataSource.getRepository(User) as any;
      mockUserRepo.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.error.message).toContain('Invalid username or password');
    });

    it('should reject login for blocked account', async () => {
      const hashedPassword = await passwordUtil.hashPassword('password123');
      const mockUser: User = {
        id: '1',
        username: 'blockeduser',
        passwordHash: hashedPassword,
        role: UserRole.ADMIN,
        accountStatus: AccountStatus.BLOCKED,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      const mockLoginAttemptRepo = AppDataSource.getRepository(LoginAttempt) as any;
      mockLoginAttemptRepo.find.mockResolvedValue([]);
      mockLoginAttemptRepo.create.mockResolvedValue({});
      mockLoginAttemptRepo.save.mockResolvedValue({});

      const mockUserRepo = AppDataSource.getRepository(User) as any;
      mockUserRepo.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'blockeduser',
          password: 'password123',
        });

      expect(response.status).toBe(403);
      expect(response.body.error.message).toContain('blocked');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        passwordHash: 'hashed',
        role: UserRole.ADMIN,
        accountStatus: AccountStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      const token = jwtUtil.generateToken({
        id: '1',
        username: 'testuser',
        role: UserRole.ADMIN,
      });

      const mockUserRepo = AppDataSource.getRepository(User) as any;
      mockUserRepo.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.id).toBe('1');
    });
  });
});

