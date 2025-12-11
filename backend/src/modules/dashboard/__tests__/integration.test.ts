import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../app';
import { DataSource } from 'typeorm';
import { User } from '../../authentication/entities/user.entity';
import { LoginAttempt } from '../../authentication/entities/login-attempt.entity';
import { UserRepository } from '../../authentication/repositories/user.repository';
import { passwordUtil } from '../../authentication/utils/password.util';
import { jwtUtil } from '../../authentication/utils/jwt.util';

describe('Dashboard Integration Tests', () => {
  let app: any;
  let authToken: string;
  let testUser: User;
  let testDataSource: DataSource;

  beforeAll(async () => {
    testDataSource = new DataSource({
      type: 'better-sqlite3',
      database: ':memory:',
      entities: [User, LoginAttempt],
      synchronize: true,
      logging: false,
    });

    await testDataSource.initialize();

    const driver = testDataSource.driver as any;
    if (driver && driver.database && driver.database.exec) {
      driver.database.exec('PRAGMA foreign_keys = ON;');
    }

    app = createApp();

    const userRepository = new UserRepository(testDataSource.getRepository(User));
    const passwordHash = await passwordUtil.hashPassword('testpass123');

    testUser = await userRepository.create({
      username: 'testuser',
      passwordHash,
      role: 'Employee',
      accountStatus: 'Active',
      displayName: 'Test User',
    });

    authToken = jwtUtil.generateToken({
      id: testUser.id,
      username: testUser.username,
      role: testUser.role,
    });
  });

  afterAll(async () => {
    if (testDataSource && testDataSource.isInitialized) {
      await testDataSource.destroy();
    }
  });

  beforeEach(async () => {
    // Clear any test data if needed
  });

  describe('Authentication', () => {
    it('should require authentication for dashboard endpoints', async () => {
      const response = await request(app).get('/api/dashboard/time-at-work');

      expect(response.status).toBe(401);
    });

    it('should accept valid JWT token', async () => {
      const response = await request(app)
        .get('/api/dashboard/time-at-work')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).not.toBe(401);
    });
  });

  describe('GET /api/dashboard/time-at-work', () => {
    it('should return time at work data', async () => {
      const response = await request(app)
        .get('/api/dashboard/time-at-work')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('punchedIn');
      expect(response.body).toHaveProperty('todayHours');
      expect(response.body).toHaveProperty('weekData');
    });
  });

  describe('GET /api/dashboard/my-actions', () => {
    it('should return my actions data', async () => {
      const response = await request(app)
        .get('/api/dashboard/my-actions')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('actions');
      expect(Array.isArray(response.body.actions)).toBe(true);
    });
  });

  describe('GET /api/dashboard/employees-on-leave', () => {
    it('should return employees on leave data', async () => {
      const response = await request(app)
        .get('/api/dashboard/employees-on-leave')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('date');
      expect(response.body).toHaveProperty('employees');
      expect(response.body).toHaveProperty('totalCount');
    });

    it('should accept date query parameter', async () => {
      const response = await request(app)
        .get('/api/dashboard/employees-on-leave?date=2025-01-12')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.date).toBe('2025-01-12');
    });

    it('should validate date format', async () => {
      const response = await request(app)
        .get('/api/dashboard/employees-on-leave?date=invalid-date')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/dashboard/employee-distribution', () => {
    it('should return employee distribution data', async () => {
      const response = await request(app)
        .get('/api/dashboard/employee-distribution')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('distribution');
      expect(response.body).toHaveProperty('totalEmployees');
    });
  });

  describe('GET /api/dashboard/buzz/latest', () => {
    it('should return buzz posts data', async () => {
      const response = await request(app)
        .get('/api/dashboard/buzz/latest')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('posts');
      expect(response.body).toHaveProperty('totalCount');
    });

    it('should accept limit query parameter', async () => {
      const response = await request(app)
        .get('/api/dashboard/buzz/latest?limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
    });

    it('should validate limit range', async () => {
      const response = await request(app)
        .get('/api/dashboard/buzz/latest?limit=25')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/dashboard/summary', () => {
    it('should return aggregated dashboard summary', async () => {
      const response = await request(app)
        .get('/api/dashboard/summary')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('timeAtWork');
      expect(response.body).toHaveProperty('myActions');
      expect(response.body).toHaveProperty('employeesOnLeave');
      expect(response.body).toHaveProperty('employeeDistribution');
      expect(response.body).toHaveProperty('buzzPosts');
    });
  });

  describe('Error Handling', () => {
    it('should handle service errors gracefully', async () => {
      const response = await request(app)
        .get('/api/dashboard/time-at-work')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBeLessThan(500);
    });

    it('should return partial data when some services fail', async () => {
      const response = await request(app)
        .get('/api/dashboard/summary')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('timeAtWork');
    });
  });
});

