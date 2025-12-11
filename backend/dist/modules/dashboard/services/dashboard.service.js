"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const logger_1 = require("../../../utils/logger");
const cache_util_1 = require("../utils/cache.util");
const CACHE_TTL_SECONDS = 300;
class DashboardService {
    constructor(timeAtWorkService, myActionsService, employeesOnLeaveService, employeeDistributionService, buzzPostsService) {
        this.timeAtWorkService = timeAtWorkService;
        this.myActionsService = myActionsService;
        this.employeesOnLeaveService = employeesOnLeaveService;
        this.employeeDistributionService = employeeDistributionService;
        this.buzzPostsService = buzzPostsService;
    }
    async getTimeAtWork(user) {
        const cacheKey = cache_util_1.CacheUtil.generateKey('dashboard', user.id, user.role, 'timeAtWork');
        const cached = cache_util_1.CacheUtil.get(cacheKey);
        if (cached) {
            logger_1.logger.info('Dashboard cache hit', { userId: user.id, widgetType: 'timeAtWork' });
            return cached;
        }
        try {
            const data = await this.timeAtWorkService.getTimeAtWorkData(user);
            cache_util_1.CacheUtil.set(cacheKey, data, CACHE_TTL_SECONDS);
            logger_1.logger.info('Dashboard data fetched', { userId: user.id, widgetType: 'timeAtWork' });
            return data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch time at work data', {
                userId: user.id,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            throw error;
        }
    }
    async getMyActions(user) {
        const cacheKey = cache_util_1.CacheUtil.generateKey('dashboard', user.id, user.role, 'myActions');
        const cached = cache_util_1.CacheUtil.get(cacheKey);
        if (cached) {
            logger_1.logger.info('Dashboard cache hit', { userId: user.id, widgetType: 'myActions' });
            return cached;
        }
        try {
            const actions = await this.myActionsService.getMyActions(user);
            const data = { actions };
            cache_util_1.CacheUtil.set(cacheKey, data, CACHE_TTL_SECONDS);
            logger_1.logger.info('Dashboard data fetched', { userId: user.id, widgetType: 'myActions', actionCount: actions.length });
            return data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch my actions data', {
                userId: user.id,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            throw error;
        }
    }
    async getEmployeesOnLeave(user, date) {
        const cacheKey = cache_util_1.CacheUtil.generateKey('dashboard', user.id, user.role, 'employeesOnLeave', date || 'today');
        const cached = cache_util_1.CacheUtil.get(cacheKey);
        if (cached) {
            logger_1.logger.info('Dashboard cache hit', { userId: user.id, widgetType: 'employeesOnLeave' });
            return cached;
        }
        try {
            const data = await this.employeesOnLeaveService.getEmployeesOnLeave(user, date);
            cache_util_1.CacheUtil.set(cacheKey, data, CACHE_TTL_SECONDS);
            logger_1.logger.info('Dashboard data fetched', {
                userId: user.id,
                widgetType: 'employeesOnLeave',
                date: date || 'today',
                employeeCount: data.totalCount,
            });
            return data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch employees on leave data', {
                userId: user.id,
                date: date || 'today',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            throw error;
        }
    }
    async getEmployeeDistribution(user) {
        const cacheKey = cache_util_1.CacheUtil.generateKey('dashboard', user.id, user.role, 'employeeDistribution');
        const cached = cache_util_1.CacheUtil.get(cacheKey);
        if (cached) {
            logger_1.logger.info('Dashboard cache hit', { userId: user.id, widgetType: 'employeeDistribution' });
            return cached;
        }
        try {
            const data = await this.employeeDistributionService.getEmployeeDistribution(user);
            cache_util_1.CacheUtil.set(cacheKey, data, CACHE_TTL_SECONDS);
            logger_1.logger.info('Dashboard data fetched', {
                userId: user.id,
                widgetType: 'employeeDistribution',
                totalEmployees: data.totalEmployees,
            });
            return data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch employee distribution data', {
                userId: user.id,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            throw error;
        }
    }
    async getBuzzPosts(user, limit) {
        const cacheKey = cache_util_1.CacheUtil.generateKey('dashboard', user.id, user.role, 'buzzPosts', String(limit || 5));
        const cached = cache_util_1.CacheUtil.get(cacheKey);
        if (cached) {
            logger_1.logger.info('Dashboard cache hit', { userId: user.id, widgetType: 'buzzPosts' });
            return cached;
        }
        try {
            const data = await this.buzzPostsService.getBuzzPosts(user, limit);
            cache_util_1.CacheUtil.set(cacheKey, data, CACHE_TTL_SECONDS);
            logger_1.logger.info('Dashboard data fetched', {
                userId: user.id,
                widgetType: 'buzzPosts',
                postCount: data.totalCount,
            });
            return data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch buzz posts data', {
                userId: user.id,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            throw error;
        }
    }
    async getDashboardSummary(user) {
        const results = await Promise.allSettled([
            this.getTimeAtWork(user).catch((error) => {
                logger_1.logger.error('Failed to fetch time at work data', { userId: user.id, error: error.message });
                return null;
            }),
            this.getMyActions(user)
                .then((data) => data.actions)
                .catch((error) => {
                logger_1.logger.error('Failed to fetch my actions data', { userId: user.id, error: error.message });
                return [];
            }),
            this.getEmployeesOnLeave(user)
                .then((data) => data.employees)
                .catch((error) => {
                logger_1.logger.error('Failed to fetch employees on leave data', {
                    userId: user.id,
                    error: error.message,
                });
                return [];
            }),
            this.getEmployeeDistribution(user)
                .then((data) => data.distribution)
                .catch((error) => {
                logger_1.logger.error('Failed to fetch employee distribution data', {
                    userId: user.id,
                    error: error.message,
                });
                return [];
            }),
            this.getBuzzPosts(user, 5)
                .then((data) => data.posts)
                .catch((error) => {
                logger_1.logger.error('Failed to fetch buzz posts data', { userId: user.id, error: error.message });
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
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map