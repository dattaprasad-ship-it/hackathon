import { logger } from '../../../utils/logger';
import { TimeAtWorkService } from './time-at-work.service';
import { MyActionsService } from './my-actions.service';
import { EmployeesOnLeaveService } from './employees-on-leave.service';
import { EmployeeDistributionService } from './employee-distribution.service';
import { BuzzPostsService } from './buzz-posts.service';
import { CacheUtil } from '../utils/cache.util';
import {
  TimeAtWorkResponseDto,
  MyActionsResponseDto,
  EmployeesOnLeaveResponseDto,
  EmployeeDistributionResponseDto,
  BuzzPostsResponseDto,
  DashboardSummaryResponseDto,
} from '../dto/dashboard.dto';
import { MinimalUser } from '../types/user.types';

const CACHE_TTL_SECONDS = 300;

export class DashboardService {
  constructor(
    private readonly timeAtWorkService: TimeAtWorkService,
    private readonly myActionsService: MyActionsService,
    private readonly employeesOnLeaveService: EmployeesOnLeaveService,
    private readonly employeeDistributionService: EmployeeDistributionService,
    private readonly buzzPostsService: BuzzPostsService
  ) {}

  async getTimeAtWork(user: MinimalUser): Promise<TimeAtWorkResponseDto> {
    const cacheKey = CacheUtil.generateKey('dashboard', user.id, user.role, 'timeAtWork');
    const cached = CacheUtil.get<TimeAtWorkResponseDto>(cacheKey);

    if (cached) {
      logger.info('Dashboard cache hit', { userId: user.id, widgetType: 'timeAtWork' });
      return cached;
    }

    try {
      const data = await this.timeAtWorkService.getTimeAtWorkData(user);
      CacheUtil.set(cacheKey, data, CACHE_TTL_SECONDS);
      logger.info('Dashboard data fetched', { userId: user.id, widgetType: 'timeAtWork' });
      return data;
    } catch (error) {
      logger.error('Failed to fetch time at work data', {
        userId: user.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async getMyActions(user: MinimalUser): Promise<MyActionsResponseDto> {
    const cacheKey = CacheUtil.generateKey('dashboard', user.id, user.role, 'myActions');
    const cached = CacheUtil.get<MyActionsResponseDto>(cacheKey);

    if (cached) {
      logger.info('Dashboard cache hit', { userId: user.id, widgetType: 'myActions' });
      return cached;
    }

    try {
      const actions = await this.myActionsService.getMyActions(user);
      const data = { actions };
      CacheUtil.set(cacheKey, data, CACHE_TTL_SECONDS);
      logger.info('Dashboard data fetched', { userId: user.id, widgetType: 'myActions', actionCount: actions.length });
      return data;
    } catch (error) {
      logger.error('Failed to fetch my actions data', {
        userId: user.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async getEmployeesOnLeave(
    user: MinimalUser,
    date?: string
  ): Promise<EmployeesOnLeaveResponseDto> {
    const cacheKey = CacheUtil.generateKey(
      'dashboard',
      user.id,
      user.role,
      'employeesOnLeave',
      date || 'today'
    );
    const cached = CacheUtil.get<EmployeesOnLeaveResponseDto>(cacheKey);

    if (cached) {
      logger.info('Dashboard cache hit', { userId: user.id, widgetType: 'employeesOnLeave' });
      return cached;
    }

    try {
      const data = await this.employeesOnLeaveService.getEmployeesOnLeave(user, date);
      CacheUtil.set(cacheKey, data, CACHE_TTL_SECONDS);
      logger.info('Dashboard data fetched', {
        userId: user.id,
        widgetType: 'employeesOnLeave',
        date: date || 'today',
        employeeCount: data.totalCount,
      });
      return data;
    } catch (error) {
      logger.error('Failed to fetch employees on leave data', {
        userId: user.id,
        date: date || 'today',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async getEmployeeDistribution(
    user: MinimalUser
  ): Promise<EmployeeDistributionResponseDto> {
    const cacheKey = CacheUtil.generateKey(
      'dashboard',
      user.id,
      user.role,
      'employeeDistribution'
    );
    const cached = CacheUtil.get<EmployeeDistributionResponseDto>(cacheKey);

    if (cached) {
      logger.info('Dashboard cache hit', { userId: user.id, widgetType: 'employeeDistribution' });
      return cached;
    }

    try {
      const data = await this.employeeDistributionService.getEmployeeDistribution(user);
      CacheUtil.set(cacheKey, data, CACHE_TTL_SECONDS);
      logger.info('Dashboard data fetched', {
        userId: user.id,
        widgetType: 'employeeDistribution',
        totalEmployees: data.totalEmployees,
      });
      return data;
    } catch (error) {
      logger.error('Failed to fetch employee distribution data', {
        userId: user.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async getBuzzPosts(user: MinimalUser, limit?: number): Promise<BuzzPostsResponseDto> {
    const cacheKey = CacheUtil.generateKey(
      'dashboard',
      user.id,
      user.role,
      'buzzPosts',
      String(limit || 5)
    );
    const cached = CacheUtil.get<BuzzPostsResponseDto>(cacheKey);

    if (cached) {
      logger.info('Dashboard cache hit', { userId: user.id, widgetType: 'buzzPosts' });
      return cached;
    }

    try {
      const data = await this.buzzPostsService.getBuzzPosts(user, limit);
      CacheUtil.set(cacheKey, data, CACHE_TTL_SECONDS);
      logger.info('Dashboard data fetched', {
        userId: user.id,
        widgetType: 'buzzPosts',
        postCount: data.totalCount,
      });
      return data;
    } catch (error) {
      logger.error('Failed to fetch buzz posts data', {
        userId: user.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async getDashboardSummary(user: MinimalUser): Promise<DashboardSummaryResponseDto> {
    const results = await Promise.allSettled([
      this.getTimeAtWork(user).catch((error) => {
        logger.error('Failed to fetch time at work data', { userId: user.id, error: error.message });
        return null;
      }),
      this.getMyActions(user)
        .then((data) => data.actions)
        .catch((error) => {
          logger.error('Failed to fetch my actions data', { userId: user.id, error: error.message });
          return [];
        }),
      this.getEmployeesOnLeave(user)
        .then((data) => data.employees)
        .catch((error) => {
          logger.error('Failed to fetch employees on leave data', {
            userId: user.id,
            error: error.message,
          });
          return [];
        }),
      this.getEmployeeDistribution(user)
        .then((data) => data.distribution)
        .catch((error) => {
          logger.error('Failed to fetch employee distribution data', {
            userId: user.id,
            error: error.message,
          });
          return [];
        }),
      this.getBuzzPosts(user, 5)
        .then((data) => data.posts)
        .catch((error) => {
          logger.error('Failed to fetch buzz posts data', { userId: user.id, error: error.message });
          return [];
        }),
    ]);

    return {
      timeAtWork: results[0].status === 'fulfilled' && results[0].value
        ? results[0].value
        : {
            punchedIn: false,
            punchInTime: '',
            timezone: 'GMT+1',
            todayHours: { hours: 0, minutes: 0, totalMinutes: 0 },
            weekData: [],
            weekRange: { start: '', end: '' },
          },
      myActions: results[1].status === 'fulfilled' ? results[1].value : [],
      employeesOnLeave: results[2].status === 'fulfilled' ? results[2].value : [],
      employeeDistribution: results[3].status === 'fulfilled' ? results[3].value : [],
      buzzPosts: results[4].status === 'fulfilled' ? results[4].value : [],
    };
  }
}

