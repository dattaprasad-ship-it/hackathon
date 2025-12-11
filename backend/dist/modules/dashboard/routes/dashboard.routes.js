"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDashboardRoutes = void 0;
const express_1 = require("express");
const jwt_auth_middleware_1 = require("../../authentication/middleware/jwt-auth.middleware");
const dashboard_validator_1 = require("../validators/dashboard.validator");
const dashboard_validator_2 = require("../validators/dashboard.validator");
const logger_1 = require("../../../utils/logger");
const createDashboardRoutes = (dashboardService, userRepository) => {
    const router = (0, express_1.Router)();
    const authMiddleware = (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository);
    router.get('/time-at-work', authMiddleware, async (req, res, next) => {
        const startTime = Date.now();
        try {
            const user = req.user;
            const data = await dashboardService.getTimeAtWork(user);
            const responseTime = Date.now() - startTime;
            logger_1.logger.info('Dashboard API request', {
                userId: user.id,
                endpoint: '/time-at-work',
                responseTime,
            });
            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    });
    router.get('/my-actions', authMiddleware, async (req, res, next) => {
        const startTime = Date.now();
        try {
            const user = req.user;
            const data = await dashboardService.getMyActions(user);
            const responseTime = Date.now() - startTime;
            logger_1.logger.info('Dashboard API request', {
                userId: user.id,
                endpoint: '/my-actions',
                responseTime,
            });
            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    });
    router.get('/employees-on-leave', authMiddleware, dashboard_validator_1.validateEmployeesOnLeaveQuery, async (req, res, next) => {
        const startTime = Date.now();
        try {
            const user = req.user;
            const date = req.query.date;
            const data = await dashboardService.getEmployeesOnLeave(user, date);
            const responseTime = Date.now() - startTime;
            logger_1.logger.info('Dashboard API request', {
                userId: user.id,
                endpoint: '/employees-on-leave',
                responseTime,
            });
            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    });
    router.get('/employee-distribution', authMiddleware, async (req, res, next) => {
        const startTime = Date.now();
        try {
            const user = req.user;
            const data = await dashboardService.getEmployeeDistribution(user);
            const responseTime = Date.now() - startTime;
            logger_1.logger.info('Dashboard API request', {
                userId: user.id,
                endpoint: '/employee-distribution',
                responseTime,
            });
            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    });
    router.get('/buzz/latest', authMiddleware, dashboard_validator_2.validateBuzzPostsQuery, async (req, res, next) => {
        const startTime = Date.now();
        try {
            const user = req.user;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
            const data = await dashboardService.getBuzzPosts(user, limit);
            const responseTime = Date.now() - startTime;
            logger_1.logger.info('Dashboard API request', {
                userId: user.id,
                endpoint: '/buzz/latest',
                responseTime,
            });
            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    });
    router.get('/summary', authMiddleware, async (req, res, next) => {
        const startTime = Date.now();
        try {
            const user = req.user;
            const data = await dashboardService.getDashboardSummary(user);
            const responseTime = Date.now() - startTime;
            logger_1.logger.info('Dashboard API request', {
                userId: user.id,
                endpoint: '/summary',
                responseTime,
            });
            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    });
    return router;
};
exports.createDashboardRoutes = createDashboardRoutes;
//# sourceMappingURL=dashboard.routes.js.map