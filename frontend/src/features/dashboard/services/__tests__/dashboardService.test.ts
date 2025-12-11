import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dashboardService } from '../dashboardService';
import { apiClient } from '@/utils/api';
import type {
  TimeAtWorkData,
  Action,
  EmployeeOnLeave,
  DistributionData,
  BuzzPost,
} from '../../types/dashboard.types';

vi.mock('@/utils/api', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('dashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTimeAtWork', () => {
    it('should fetch time at work data successfully', async () => {
      const mockData: TimeAtWorkData = {
        punchedIn: true,
        punchInTime: '2025-01-12T11:50:00Z',
        timezone: 'GMT+1',
        todayHours: {
          hours: 0,
          minutes: 27,
          totalMinutes: 27,
        },
        weekData: [
          {
            date: '2025-01-08',
            day: 'Mon',
            hours: 8,
            minutes: 0,
          },
        ],
        weekRange: {
          start: '2025-01-08',
          end: '2025-01-14',
        },
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const result = await dashboardService.getTimeAtWork();

      expect(apiClient.get).toHaveBeenCalledWith('/dashboard/time-at-work');
      expect(result).toEqual(mockData);
    });

    it('should handle 401 unauthorized error', async () => {
      vi.mocked(apiClient.get).mockRejectedValue({
        response: {
          status: 401,
          data: {
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication token required or invalid',
            },
          },
        },
        isAxiosError: true,
      });

      await expect(dashboardService.getTimeAtWork()).rejects.toThrow(
        'Authentication token required or invalid'
      );
    });

    it('should handle 500 server error', async () => {
      vi.mocked(apiClient.get).mockRejectedValue({
        response: {
          status: 500,
          data: {
            error: {
              code: 'INTERNAL_ERROR',
              message: 'An error occurred while processing your request',
            },
          },
        },
        isAxiosError: true,
      });

      await expect(dashboardService.getTimeAtWork()).rejects.toThrow(
        'An error occurred while processing your request'
      );
    });

    it('should handle network error', async () => {
      vi.mocked(apiClient.get).mockRejectedValue({
        request: {},
        message: 'Network Error',
        isAxiosError: true,
      });

      await expect(dashboardService.getTimeAtWork()).rejects.toThrow(
        'Network Error: Backend API is not available. Please ensure the backend server is running.'
      );
    });
  });

  describe('getMyActions', () => {
    it('should fetch my actions data successfully', async () => {
      const mockData: Action[] = [
        {
          type: 'timesheet_approval',
          title: 'Timesheet to Approve',
          count: 1,
          icon: 'calendar',
          url: '/time/timesheets/approve',
        },
        {
          type: 'self_review',
          title: 'Pending Self Review',
          count: 1,
          icon: 'person-heart',
          url: '/performance/reviews/self',
        },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({
        data: { actions: mockData },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const result = await dashboardService.getMyActions();

      expect(apiClient.get).toHaveBeenCalledWith('/dashboard/my-actions');
      expect(result).toEqual(mockData);
    });

    it('should handle 401 unauthorized error', async () => {
      vi.mocked(apiClient.get).mockRejectedValue({
        response: {
          status: 401,
          data: {
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication token required or invalid',
            },
          },
        },
        isAxiosError: true,
      });

      await expect(dashboardService.getMyActions()).rejects.toThrow(
        'Authentication token required or invalid'
      );
    });

    it('should handle 500 server error', async () => {
      vi.mocked(apiClient.get).mockRejectedValue({
        response: {
          status: 500,
          data: {
            error: {
              code: 'INTERNAL_ERROR',
              message: 'An error occurred while processing your request',
            },
          },
        },
        isAxiosError: true,
      });

      await expect(dashboardService.getMyActions()).rejects.toThrow(
        'An error occurred while processing your request'
      );
    });
  });

  describe('getEmployeesOnLeave', () => {
    it('should fetch employees on leave data successfully', async () => {
      const mockData: EmployeeOnLeave[] = [
        {
          id: 'uuid-123',
          name: 'John Doe',
          displayName: 'John Doe',
          department: 'Engineering',
          leaveType: 'Annual Leave',
          startDate: '2025-01-12',
          endDate: '2025-01-12',
          profilePicture: 'https://example.com/profile.jpg',
        },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({
        data: {
          date: '2025-01-12',
          employees: mockData,
          totalCount: 1,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const result = await dashboardService.getEmployeesOnLeave();

      expect(apiClient.get).toHaveBeenCalledWith('/dashboard/employees-on-leave', undefined);
      expect(result).toEqual(mockData);
    });

    it('should fetch employees on leave for specific date', async () => {
      const mockData: EmployeeOnLeave[] = [];

      vi.mocked(apiClient.get).mockResolvedValue({
        data: {
          date: '2025-01-13',
          employees: mockData,
          totalCount: 0,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const result = await dashboardService.getEmployeesOnLeave('2025-01-13');

      expect(apiClient.get).toHaveBeenCalledWith('/dashboard/employees-on-leave', {
        params: { date: '2025-01-13' },
      });
      expect(result).toEqual(mockData);
    });

    it('should handle 401 unauthorized error', async () => {
      vi.mocked(apiClient.get).mockRejectedValue({
        response: {
          status: 401,
          data: {
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication token required or invalid',
            },
          },
        },
        isAxiosError: true,
      });

      await expect(dashboardService.getEmployeesOnLeave()).rejects.toThrow(
        'Authentication token required or invalid'
      );
    });
  });

  describe('getEmployeeDistribution', () => {
    it('should fetch employee distribution data successfully', async () => {
      const mockData: DistributionData[] = [
        {
          subUnit: 'Engineering',
          count: 45,
          percentage: 75.0,
          color: '#FF5733',
        },
        {
          subUnit: 'Sales',
          count: 10,
          percentage: 16.7,
          color: '#FFC300',
        },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({
        data: {
          distribution: mockData,
          totalEmployees: 60,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const result = await dashboardService.getEmployeeDistribution();

      expect(apiClient.get).toHaveBeenCalledWith('/dashboard/employee-distribution');
      expect(result).toEqual(mockData);
    });

    it('should handle 401 unauthorized error', async () => {
      vi.mocked(apiClient.get).mockRejectedValue({
        response: {
          status: 401,
          data: {
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication token required or invalid',
            },
          },
        },
        isAxiosError: true,
      });

      await expect(dashboardService.getEmployeeDistribution()).rejects.toThrow(
        'Authentication token required or invalid'
      );
    });
  });

  describe('getBuzzPosts', () => {
    it('should fetch buzz posts data successfully', async () => {
      const mockData: BuzzPost[] = [
        {
          id: 'post-uuid',
          author: {
            id: 'user-uuid',
            name: 'Test Automation User',
            displayName: 'Test Automation User',
            profilePicture: 'https://example.com/avatar.jpg',
          },
          content: 'Post text content',
          images: [],
          timestamp: '2025-10-12T16:42:00Z',
          likes: 5,
          comments: 2,
        },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({
        data: {
          posts: mockData,
          totalCount: 1,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const result = await dashboardService.getBuzzPosts();

      expect(apiClient.get).toHaveBeenCalledWith('/dashboard/buzz/latest', undefined);
      expect(result).toEqual(mockData);
    });

    it('should fetch buzz posts with limit parameter', async () => {
      const mockData: BuzzPost[] = [];

      vi.mocked(apiClient.get).mockResolvedValue({
        data: {
          posts: mockData,
          totalCount: 0,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const result = await dashboardService.getBuzzPosts(10);

      expect(apiClient.get).toHaveBeenCalledWith('/dashboard/buzz/latest', {
        params: { limit: 10 },
      });
      expect(result).toEqual(mockData);
    });

    it('should handle 401 unauthorized error', async () => {
      vi.mocked(apiClient.get).mockRejectedValue({
        response: {
          status: 401,
          data: {
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication token required or invalid',
            },
          },
        },
        isAxiosError: true,
      });

      await expect(dashboardService.getBuzzPosts()).rejects.toThrow(
        'Authentication token required or invalid'
      );
    });

    it('should handle 400 validation error', async () => {
      vi.mocked(apiClient.get).mockRejectedValue({
        response: {
          status: 400,
          data: {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid query parameters',
              details: {
                limit: 'Must be between 1 and 20',
              },
            },
          },
        },
        isAxiosError: true,
      });

      await expect(dashboardService.getBuzzPosts(25)).rejects.toThrow(
        'Invalid query parameters'
      );
    });
  });
});

