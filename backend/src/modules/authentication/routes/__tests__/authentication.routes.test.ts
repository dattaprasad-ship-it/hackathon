import request from 'supertest';
import express, { Express } from 'express';
import { createAuthenticationRoutes } from '../authentication.routes';
import { AuthenticationService } from '../../services/authentication.service';
import { UserRepository } from '../../repositories/user.repository';
import { LoginAttemptRepository } from '../../repositories/login-attempt.repository';
import { RateLimitService } from '../../services/rate-limit.service';
import { jwtUtil } from '../../utils/jwt.util';
import { User } from '../../entities/user.entity';
import { UserRole } from '../../../../constants/enums/user-role.enum';
import { AccountStatus } from '../../../../constants/enums/account-status.enum';
import { when } from 'jest-when';

jest.mock('../../utils/jwt.util');

describe('Authentication Routes', () => {
  let app: Express;
  let authenticationService: AuthenticationService;
  let userRepository: UserRepository;
  let loginAttemptRepository: LoginAttemptRepository;
  let rateLimitService: RateLimitService;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    loginAttemptRepository = {
      createAttempt: jest.fn(),
      findRecentAttemptsByIp: jest.fn(),
      findRecentAttemptsByUsername: jest.fn(),
    } as any;

    rateLimitService = new RateLimitService(loginAttemptRepository);

    userRepository = {
      findByUsername: jest.fn(),
      findById: jest.fn(),
      updateLastLogin: jest.fn(),
    } as any;

    authenticationService = new AuthenticationService(
      userRepository,
      loginAttemptRepository,
      rateLimitService
    );

    const authRoutes = createAuthenticationRoutes(authenticationService, userRepository);
    app.use('/api/auth', authRoutes);
  });

  describe('POST /api/auth/login', () => {
    it('should return 200 with token and user on successful login', async () => {
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        passwordHash: 'hashed',
        role: UserRole.ADMIN,
        accountStatus: AccountStatus.ACTIVE,
        displayName: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      when(userRepository.findByUsername).calledWith('testuser').mockResolvedValue(mockUser);

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
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app).post('/api/auth/login').send({
        username: '',
        password: '',
      });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 401 for invalid credentials', async () => {
      when(userRepository.findByUsername).calledWith('testuser').mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user info with valid token', async () => {
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        passwordHash: 'hashed',
        role: UserRole.ADMIN,
        accountStatus: AccountStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      const token = 'valid.token';

      (jwtUtil.verifyToken as jest.Mock).mockReturnValue({
        id: '1',
        username: 'testuser',
        role: UserRole.ADMIN,
      });

      when(userRepository.findById).calledWith('1').mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      (jwtUtil.verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/auth/validate', () => {
    it('should return 200 with valid token', async () => {
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        passwordHash: 'hashed',
        role: UserRole.ADMIN,
        accountStatus: AccountStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      const token = 'valid.token';

      (jwtUtil.verifyToken as jest.Mock).mockReturnValue({
        id: '1',
        username: 'testuser',
        role: UserRole.ADMIN,
      });

      when(userRepository.findById).calledWith('1').mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/auth/validate')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.valid).toBe(true);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should return 200 on logout', async () => {
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        passwordHash: 'hashed',
        role: UserRole.ADMIN,
        accountStatus: AccountStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      const token = 'valid.token';

      (jwtUtil.verifyToken as jest.Mock).mockReturnValue({
        id: '1',
        username: 'testuser',
        role: UserRole.ADMIN,
      });

      when(userRepository.findById).calledWith('1').mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logged out successfully');
    });
  });
});

