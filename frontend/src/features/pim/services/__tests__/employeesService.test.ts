import axios from 'axios';
import { employeesService } from '../employeesService';
import type { EmployeeListFilters, CreateEmployeeRequest } from '../../types/employees.types';
import { storage } from '@/utils/storage';

jest.mock('axios');
jest.mock('@/utils/storage', () => ({
  storage: {
    getToken: jest.fn(),
  },
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedStorage = storage as jest.Mocked<typeof storage>;

describe('employeesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockedStorage.getToken as jest.Mock) = jest.fn().mockReturnValue('test-token');
  });

  describe('list', () => {
    it('should fetch employees list with filters', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: '1',
              employeeId: '0445',
              firstName: 'John',
              lastName: 'Doe',
            },
          ],
          pagination: {
            page: 1,
            limit: 50,
            total: 1,
            totalPages: 1,
          },
          recordCount: '(1) Records Found',
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const filters: EmployeeListFilters = {
        employeeName: 'John',
        page: 1,
        limit: 50,
      };

      const result = await employeesService.list(filters);

      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(mockedAxios.get).toHaveBeenCalled();
      expect(mockedStorage.getToken).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      const mockEmployee = {
        id: '1',
        employeeId: '0445',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockedAxios.post.mockResolvedValue({ data: mockEmployee });

      const createData: CreateEmployeeRequest = {
        employeeId: '0445',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = await employeesService.create(createData);

      expect(result.employeeId).toBe('0445');
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(mockedStorage.getToken).toHaveBeenCalled();
    });
  });
});

