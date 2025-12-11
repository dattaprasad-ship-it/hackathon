"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReportsRoutes = void 0;
const express_1 = require("express");
const jwt_auth_middleware_1 = require("../../authentication/middleware/jwt-auth.middleware");
const logger_1 = require("../../../utils/logger");
const createReportsRoutes = (reportsService, userRepository) => {
    const router = (0, express_1.Router)();
    router.use((0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository));
    router.get('/', async (req, res, next) => {
        try {
            const reportName = req.query.reportName;
            const reports = await reportsService.findAll(reportName);
            res.status(200).json({ data: reports });
        }
        catch (error) {
            logger_1.logger.error(`Error fetching reports: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
            next(error);
        }
    });
    router.get('/:id', async (req, res, next) => {
        try {
            const report = await reportsService.findOne(req.params.id);
            res.status(200).json(report);
        }
        catch (error) {
            logger_1.logger.error(`Error fetching report ${req.params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
            next(error);
        }
    });
    router.post('/', async (req, res, next) => {
        try {
            const report = await reportsService.create(req.body, req.user?.username);
            res.status(201).json(report);
        }
        catch (error) {
            logger_1.logger.error(`Error creating report: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
            next(error);
        }
    });
    router.put('/:id', async (req, res, next) => {
        try {
            const report = await reportsService.update(req.params.id, req.body, req.user?.username);
            res.status(200).json(report);
        }
        catch (error) {
            logger_1.logger.error(`Error updating report ${req.params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
            next(error);
        }
    });
    router.delete('/:id', async (req, res, next) => {
        try {
            await reportsService.delete(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            logger_1.logger.error(`Error deleting report ${req.params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
            next(error);
        }
    });
    router.post('/:id/execute', async (req, res, next) => {
        try {
            const result = await reportsService.executeReport(req.params.id);
            res.status(200).json(result);
        }
        catch (error) {
            logger_1.logger.error(`Error executing report ${req.params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
            next(error);
        }
    });
    return router;
};
exports.createReportsRoutes = createReportsRoutes;
//# sourceMappingURL=reports.routes.js.map