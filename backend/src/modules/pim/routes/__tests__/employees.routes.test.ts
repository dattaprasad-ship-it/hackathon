import request from 'supertest';
import express, { Express } from 'express';
import { createEmployeesRoutes } from '../employees.routes';
import { EmployeesService } from '../../services/employees.service';
import { UserRepository } from '../../../authentication/repositories/user.repository';
import { AppDataSource } from '../../../../config/database';
import { User } from '../../../authentication/entities/user.entity';
import { jwtAuthMiddleware } from '../../../authentication/middleware/jwt-auth.middleware';
import { errorHandler } from '../../../../middleware/error-handler.middleware';

jest.mock('../../../authentication/middleware/jwt-auth.middleware');
jest.mock('../../../../config/database');

const mockJwtAuthMiddleware = jwtAuthMiddleware as jest.MockedFunction<typeof jwtAuthMiddleware>;

describe('Employees Routes', () => {
  let app: Express;
  let employeesService: jest.Mocked<EmployeesService>;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    employeesService = {
      list: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    userRepository = {} as any;

    mockJwtAuthMiddleware.mockImplementation(() => {
      return (req: any, res: any, next: any) => {
        req.user = { id: '1', username: 'admin', role: 'Admin' };
        next();
      };
    });

    const employeesRoutes = createEmployeesRoutes(employeesService, userRepository);
    app.use('/api/employees', employeesRoutes);
    app.use(errorHandler);
  });

  describe('GET /api/employees', () => {
    it('should return list of employees with pagination', async () => {
      const mockEmployees = [
        {
          id: '1',
          employeeId: '0445',
          firstName: 'John',
          lastName: 'Doe',
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      employeesService.list.mockResolvedValue({
        employees: mockEmployees as any,
        total: 1,
      });

      const response = await request(app)
        .get('/api/employees')
        .query({ page: 1, limit: 50 });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination.total).toBe(1);
      expect(response.body.recordCount).toBe('(1) Records Found');
    });

    it('should filter employees by name', async () => {
      employeesService.list.mockResolvedValue({
        employees: [] as any,
        total: 0,
      });

      const response = await request(app)
        .get('/api/employees')
        .query({ employeeName: 'John' });

      expect(response.status).toBe(200);
      expect(employeesService.list).toHaveBeenCalledWith(
        expect.objectContaining({ employeeName: 'John' })
      );
    });
  });

  describe('GET /api/employees/:id', () => {
    it('should return employee by id', async () => {
      const mockEmployee = {
        id: '1',
        employeeId: '0445',
        firstName: 'John',
        lastName: 'Doe',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      employeesService.findById.mockResolvedValue(mockEmployee as any);

      const response = await request(app).get('/api/employees/1');

      expect(response.status).toBe(200);
      expect(response.body.employeeId).toBe('0445');
    });

    it('should return 404 if employee not found', async () => {
      employeesService.findById.mockResolvedValue(null);

      const response = await request(app).get('/api/employees/999');

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('POST /api/employees', () => {
    it('should create a new employee', async () => {
      const createDto = {
        employeeId: '0445',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockEmployee = {
        id: '1',
        ...createDto,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      employeesService.create.mockResolvedValue(mockEmployee as any);

      const response = await request(app)
        .post('/api/employees')
        .send(createDto);

      expect(response.status).toBe(201);
      expect(response.body.employeeId).toBe('0445');
      expect(employeesService.create).toHaveBeenCalledWith(createDto);
    });

    it('should return 400 if validation fails', async () => {
      const invalidDto = {
        firstName: 'John',
      };

      const response = await request(app)
        .post('/api/employees')
        .send(invalidDto);

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});

