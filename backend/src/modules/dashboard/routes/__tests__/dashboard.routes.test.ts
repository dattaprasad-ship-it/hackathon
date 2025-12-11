import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import { createDashboardRoutes } from '../dashboard.routes';
import { DashboardService } from '../../services/dashboard.service';
import { jwtAuthMiddleware } from '../../../modules/authentication/middleware/jwt-auth.middleware';
import { UserRepository } from '../../../modules/authentication/repositories/user.repository';
import { AppDataSource } from '../../../config/database';
import { User } from '../../../modules/authentication/entities/user.entity';

vi.mock('../../../modules/authentication/middleware/jwt-auth.middleware');
vi.mock('../../../modules/authentication/repositories/user.repository');
vi.mock('../../../config/database');

describe('Dashboard Routes', () => {
  let app: Express;
  let mockDashboardService: any;
  let mockUserRepository: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockDashboardService = {
      getTimeAtWork: vi.fn(),
      getMyActions: vi.fn(),
      getEmployeesOnLeave: vi.fn(),
      getEmployeeDistribution: vi.fn(),
      getBuzzPosts: vi.fn(),
      getDashboardSummary: vi.fn(),
    };

    mockUserRepository = {
      findById: vi.fn(),
    };

    vi.mocked(jwtAuthMiddleware).mockImplementation(() => {
      return (req: any, res: any, next: any) => {
        req.user = { id: 'user-1', username: 'testuser', role: 'Employee' };
        next();
      };
    });

    app = express();
    app.use(express.json());
    const routes = createDashboardRoutes(mockDashboardService, mockUserRepository);
    app.use('/api/dashboard', routes);
  });

  describe('GET /api/dashboard/time-at-work', () => {
    it('should return time at work data', async () => {
      const mockData = {
        punchedIn: true,
        punchInTime: '2025-01-12T11:50:00Z',
        timezone: 'GMT+1',
        todayHours: { hours: 0, minutes: 27, totalMinutes: 27 },
        weekData: [],
        weekRange: { start: '2025-01-08', end: '2025-01-14' },
      };

      mockDashboardService.getTimeAtWork.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/dashboard/time-at-work')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it('should require authentication', async () => {
      vi.mocked(jwtAuthMiddleware).mockImplementation(() => {
        return (req: any, res: any, next: any) => {
          const error: any = new Error('Authentication required');
          error.statusCode = 401;
          next(error);
        };
      });

      const response = await request(app).get('/api/dashboard/time-at-work');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/dashboard/my-actions', () => {
    it('should return my actions data', async () => {
      const mockData = {
        actions: [
          {
            type: 'self_review',
            title: 'Pending Self Review',
            count: 1,
            icon: 'person-heart',
            url: '/performance/reviews/self',
          },
        ],
      };

      mockDashboardService.getMyActions.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/dashboard/my-actions')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });
  });

  describe('GET /api/dashboard/employees-on-leave', () => {
    it('should return employees on leave data', async () => {
      const mockData = {
        date: '2025-01-12',
        employees: [],
        totalCount: 0,
      };

      mockDashboardService.getEmployeesOnLeave.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/dashboard/employees-on-leave')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it('should accept date query parameter', async () => {
      const mockData = {
        date: '2025-01-13',
        employees: [],
        totalCount: 0,
      };

      mockDashboardService.getEmployeesOnLeave.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/dashboard/employees-on-leave?date=2025-01-13')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(mockDashboardService.getEmployeesOnLeave).toHaveBeenCalledWith(
        expect.any(Object),
        '2025-01-13'
      );
    });
  });

  describe('GET /api/dashboard/employee-distribution', () => {
    it('should return employee distribution data', async () => {
      const mockData = {
        distribution: [
          { subUnit: 'Engineering', count: 45, percentage: 75.0, color: '#FF5733' },
        ],
        totalEmployees: 60,
      };

      mockDashboardService.getEmployeeDistribution.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/dashboard/employee-distribution')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });
  });

  describe('GET /api/dashboard/buzz/latest', () => {
    it('should return buzz posts data', async () => {
      const mockData = {
        posts: [],
        totalCount: 0,
      };

      mockDashboardService.getBuzzPosts.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/dashboard/buzz/latest')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it('should accept limit query parameter', async () => {
      const mockData = {
        posts: [],
        totalCount: 0,
      };

      mockDashboardService.getBuzzPosts.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/dashboard/buzz/latest?limit=10')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(mockDashboardService.getBuzzPosts).toHaveBeenCalledWith(expect.any(Object), 10);
    });
  });

  describe('GET /api/dashboard/summary', () => {
    it('should return aggregated dashboard summary', async () => {
      const mockData = {
        timeAtWork: { punchedIn: true },
        myActions: [],
        employeesOnLeave: [],
        employeeDistribution: [],
        buzzPosts: [],
      };

      mockDashboardService.getDashboardSummary.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/dashboard/summary')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });
  });
});

