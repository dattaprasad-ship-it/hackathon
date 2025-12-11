import { describe, it, expect, vi, beforeEach } from 'vitest';
import { when } from 'jest-when';
import { DashboardService } from '../dashboard.service';
import { TimeAtWorkService } from '../time-at-work.service';
import { MyActionsService } from '../my-actions.service';
import { EmployeesOnLeaveService } from '../employees-on-leave.service';
import { EmployeeDistributionService } from '../employee-distribution.service';
import { BuzzPostsService } from '../buzz-posts.service';
import { CacheUtil } from '../../utils/cache.util';
import { UserRole } from '../../../constants/enums/user-role.enum';

describe('DashboardService', () => {
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

  describe('getTimeAtWork', () => {
    it('should return cached data when available', async () => {
      const cacheKey = CacheUtil.generateKey('dashboard', 'user-1', UserRole.Employee, 'timeAtWork');
      const cachedData = { punchedIn: true, punchInTime: '2025-01-12T11:50:00Z' };
      CacheUtil.set(cacheKey, cachedData, 300);

      const result = await service.getTimeAtWork(mockUser);

      expect(result).toEqual(cachedData);
      expect(mockTimeAtWorkService.getTimeAtWorkData).not.toHaveBeenCalled();
    });

    it('should fetch and cache data when not cached', async () => {
      const mockData = { punchedIn: true, punchInTime: '2025-01-12T11:50:00Z' };
      when(mockTimeAtWorkService.getTimeAtWorkData)
        .calledWith(mockUser)
        .mockResolvedValue(mockData);

      const result = await service.getTimeAtWork(mockUser);

      expect(result).toEqual(mockData);
      expect(mockTimeAtWorkService.getTimeAtWorkData).toHaveBeenCalledWith(mockUser);

      const cacheKey = CacheUtil.generateKey('dashboard', 'user-1', UserRole.Employee, 'timeAtWork');
      const cached = CacheUtil.get(cacheKey);
      expect(cached).toEqual(mockData);
    });

    it('should handle service errors gracefully', async () => {
      when(mockTimeAtWorkService.getTimeAtWorkData)
        .calledWith(mockUser)
        .mockRejectedValue(new Error('Service error'));

      await expect(service.getTimeAtWork(mockUser)).rejects.toThrow('Service error');
    });
  });

  describe('getMyActions', () => {
    it('should return cached data when available', async () => {
      const cacheKey = CacheUtil.generateKey('dashboard', 'user-1', UserRole.Employee, 'myActions');
      const cachedData = [{ type: 'self_review', title: 'Pending Self Review', count: 1 }];
      CacheUtil.set(cacheKey, cachedData, 300);

      const result = await service.getMyActions(mockUser);

      expect(result).toEqual(cachedData);
      expect(mockMyActionsService.getMyActions).not.toHaveBeenCalled();
    });

    it('should fetch and cache data when not cached', async () => {
      const mockData = [{ type: 'self_review', title: 'Pending Self Review', count: 1 }];
      when(mockMyActionsService.getMyActions)
        .calledWith(mockUser)
        .mockResolvedValue(mockData);

      const result = await service.getMyActions(mockUser);

      expect(result).toEqual(mockData);
    });
  });

  describe('getEmployeesOnLeave', () => {
    it('should return cached data when available', async () => {
      const cacheKey = CacheUtil.generateKey(
        'dashboard',
        'user-1',
        UserRole.Employee,
        'employeesOnLeave',
        '2025-01-12'
      );
      const cachedData = { date: '2025-01-12', employees: [], totalCount: 0 };
      CacheUtil.set(cacheKey, cachedData, 300);

      const result = await service.getEmployeesOnLeave(mockUser, '2025-01-12');

      expect(result).toEqual(cachedData);
      expect(mockEmployeesOnLeaveService.getEmployeesOnLeave).not.toHaveBeenCalled();
    });

    it('should fetch and cache data when not cached', async () => {
      const mockData = { date: '2025-01-12', employees: [], totalCount: 0 };
      when(mockEmployeesOnLeaveService.getEmployeesOnLeave)
        .calledWith(mockUser, '2025-01-12')
        .mockResolvedValue(mockData);

      const result = await service.getEmployeesOnLeave(mockUser, '2025-01-12');

      expect(result).toEqual(mockData);
    });
  });

  describe('getEmployeeDistribution', () => {
    it('should return cached data when available', async () => {
      const cacheKey = CacheUtil.generateKey(
        'dashboard',
        'user-1',
        UserRole.Employee,
        'employeeDistribution'
      );
      const cachedData = { distribution: [], totalEmployees: 0 };
      CacheUtil.set(cacheKey, cachedData, 300);

      const result = await service.getEmployeeDistribution(mockUser);

      expect(result).toEqual(cachedData);
      expect(mockEmployeeDistributionService.getEmployeeDistribution).not.toHaveBeenCalled();
    });

    it('should fetch and cache data when not cached', async () => {
      const mockData = { distribution: [], totalEmployees: 0 };
      when(mockEmployeeDistributionService.getEmployeeDistribution)
        .calledWith(mockUser)
        .mockResolvedValue(mockData);

      const result = await service.getEmployeeDistribution(mockUser);

      expect(result).toEqual(mockData);
    });
  });

  describe('getBuzzPosts', () => {
    it('should return cached data when available', async () => {
      const cacheKey = CacheUtil.generateKey('dashboard', 'user-1', UserRole.Employee, 'buzzPosts', '5');
      const cachedData = { posts: [], totalCount: 0 };
      CacheUtil.set(cacheKey, cachedData, 300);

      const result = await service.getBuzzPosts(mockUser, 5);

      expect(result).toEqual(cachedData);
      expect(mockBuzzPostsService.getBuzzPosts).not.toHaveBeenCalled();
    });

    it('should fetch and cache data when not cached', async () => {
      const mockData = { posts: [], totalCount: 0 };
      when(mockBuzzPostsService.getBuzzPosts)
        .calledWith(mockUser, 5)
        .mockResolvedValue(mockData);

      const result = await service.getBuzzPosts(mockUser, 5);

      expect(result).toEqual(mockData);
    });
  });

  describe('getDashboardSummary', () => {
    it('should aggregate all widget data', async () => {
      const timeAtWorkData = { punchedIn: true, punchInTime: '2025-01-12T11:50:00Z' };
      const myActionsData = [{ type: 'self_review', title: 'Pending Self Review', count: 1 }];
      const employeesOnLeaveData = { date: '2025-01-12', employees: [], totalCount: 0 };
      const employeeDistributionData = { distribution: [], totalEmployees: 0 };
      const buzzPostsData = { posts: [], totalCount: 0 };

      when(mockTimeAtWorkService.getTimeAtWorkData)
        .calledWith(mockUser)
        .mockResolvedValue(timeAtWorkData);
      when(mockMyActionsService.getMyActions)
        .calledWith(mockUser)
        .mockResolvedValue(myActionsData);
      when(mockEmployeesOnLeaveService.getEmployeesOnLeave)
        .calledWith(mockUser)
        .mockResolvedValue(employeesOnLeaveData);
      when(mockEmployeeDistributionService.getEmployeeDistribution)
        .calledWith(mockUser)
        .mockResolvedValue(employeeDistributionData);
      when(mockBuzzPostsService.getBuzzPosts)
        .calledWith(mockUser, 5)
        .mockResolvedValue(buzzPostsData);

      const result = await service.getDashboardSummary(mockUser);

      expect(result.timeAtWork).toEqual(timeAtWorkData);
      expect(result.myActions).toEqual(myActionsData);
      expect(result.employeesOnLeave).toEqual(employeesOnLeaveData.employees);
      expect(result.employeeDistribution).toEqual(employeeDistributionData.distribution);
      expect(result.buzzPosts).toEqual(buzzPostsData.posts);
    });

    it('should handle partial failures gracefully', async () => {
      const timeAtWorkData = { punchedIn: true, punchInTime: '2025-01-12T11:50:00Z' };
      const employeesOnLeaveData = { date: '2025-01-12', employees: [], totalCount: 0 };

      when(mockTimeAtWorkService.getTimeAtWorkData)
        .calledWith(mockUser)
        .mockResolvedValue(timeAtWorkData);
      when(mockMyActionsService.getMyActions)
        .calledWith(mockUser)
        .mockRejectedValue(new Error('Service unavailable'));
      when(mockEmployeesOnLeaveService.getEmployeesOnLeave)
        .calledWith(mockUser)
        .mockResolvedValue(employeesOnLeaveData);
      when(mockEmployeeDistributionService.getEmployeeDistribution)
        .calledWith(mockUser)
        .mockRejectedValue(new Error('Service unavailable'));
      when(mockBuzzPostsService.getBuzzPosts)
        .calledWith(mockUser, 5)
        .mockResolvedValue({ posts: [], totalCount: 0 });

      const result = await service.getDashboardSummary(mockUser);

      expect(result.timeAtWork).toEqual(timeAtWorkData);
      expect(result.myActions).toEqual([]);
      expect(result.employeesOnLeave).toEqual([]);
      expect(result.employeeDistribution).toEqual([]);
      expect(result.buzzPosts).toEqual([]);
    });
  });
});

