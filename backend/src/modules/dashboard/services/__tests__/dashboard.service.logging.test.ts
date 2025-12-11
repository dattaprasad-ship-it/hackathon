import { describe, it, expect, vi, beforeEach } from 'vitest';
import { when } from 'jest-when';
import { DashboardService } from '../dashboard.service';
import { TimeAtWorkService } from '../time-at-work.service';
import { MyActionsService } from '../my-actions.service';
import { EmployeesOnLeaveService } from '../employees-on-leave.service';
import { EmployeeDistributionService } from '../employee-distribution.service';
import { BuzzPostsService } from '../buzz-posts.service';
import { CacheUtil } from '../../utils/cache.util';
import { logger } from '../../../../utils/logger';
import { UserRole } from '../../../../constants/enums/user-role.enum';

vi.mock('../../../../utils/logger');

describe('DashboardService Logging', () => {
  let service: DashboardService;
  let mockTimeAtWorkService: any;
  let mockMyActionsService: any;
  let mockEmployeesOnLeaveService: any;
  let mockEmployeeDistributionService: any;
  let mockBuzzPostsService: any;
  let mockUser: any;

  beforeEach(() => {
    CacheUtil.clear();
    vi.clearAllMocks();

    mockTimeAtWorkService = {
      getTimeAtWorkData: vi.fn(),
    };
    mockMyActionsService = {
      getMyActions: vi.fn(),
    };
    mockEmployeesOnLeaveService = {
      getEmployeesOnLeave: vi.fn(),
    };
    mockEmployeeDistributionService = {
      getEmployeeDistribution: vi.fn(),
    };
    mockBuzzPostsService = {
      getBuzzPosts: vi.fn(),
    };

    service = new DashboardService(
      mockTimeAtWorkService,
      mockMyActionsService,
      mockEmployeesOnLeaveService,
      mockEmployeeDistributionService,
      mockBuzzPostsService
    );

    mockUser = {
      id: 'user-1',
      username: 'testuser',
      role: UserRole.Employee,
    };
  });

  describe('Logging', () => {
    it('should log cache hit', async () => {
      const cacheKey = CacheUtil.generateKey('dashboard', 'user-1', UserRole.Employee, 'timeAtWork');
      const cachedData = { punchedIn: true };
      CacheUtil.set(cacheKey, cachedData, 300);

      await service.getTimeAtWork(mockUser);

      expect(logger.info).toHaveBeenCalledWith('Dashboard cache hit', {
        userId: 'user-1',
        widgetType: 'timeAtWork',
      });
    });

    it('should log successful data fetch', async () => {
      const mockData = { punchedIn: true };
      when(mockTimeAtWorkService.getTimeAtWorkData)
        .calledWith(mockUser)
        .mockResolvedValue(mockData);

      await service.getTimeAtWork(mockUser);

      expect(logger.info).toHaveBeenCalledWith('Dashboard data fetched', {
        userId: 'user-1',
        widgetType: 'timeAtWork',
      });
    });

    it('should log errors', async () => {
      when(mockTimeAtWorkService.getTimeAtWorkData)
        .calledWith(mockUser)
        .mockRejectedValue(new Error('Service error'));

      await expect(service.getTimeAtWork(mockUser)).rejects.toThrow();

      expect(logger.error).toHaveBeenCalledWith('Failed to fetch time at work data', {
        userId: 'user-1',
        error: 'Service error',
      });
    });

    it('should log aggregation errors in getDashboardSummary', async () => {
      when(mockTimeAtWorkService.getTimeAtWorkData)
        .calledWith(mockUser)
        .mockResolvedValue({ punchedIn: true });
      when(mockMyActionsService.getMyActions)
        .calledWith(mockUser)
        .mockRejectedValue(new Error('Service unavailable'));

      await service.getDashboardSummary(mockUser);

      expect(logger.error).toHaveBeenCalledWith('Failed to fetch my actions data', {
        userId: 'user-1',
        error: 'Service unavailable',
      });
    });
  });
});

