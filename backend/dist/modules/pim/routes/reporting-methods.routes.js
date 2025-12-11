"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReportingMethodsRoutes = void 0;
const express_1 = require("express");
const jwt_auth_middleware_1 = require("../../authentication/middleware/jwt-auth.middleware");
const business_exception_1 = require("../../../common/exceptions/business.exception");
const createReportingMethodsRoutes = (reportingMethodRepository, userRepository) => {
    const router = (0, express_1.Router)();
    router.get('/', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), async (req, res, next) => {
        try {
            const methods = await reportingMethodRepository.findAll();
            res.status(200).json({ data: methods });
        }
        catch (error) {
            next(error);
        }
    });
    router.post('/', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), async (req, res, next) => {
        try {
            const { name } = req.body;
            if (!name || !name.trim()) {
                throw new business_exception_1.BusinessException('Name is required', 400);
            }
            const existing = await reportingMethodRepository.findOne({ where: { name: name.trim() } });
            if (existing) {
                throw new business_exception_1.BusinessException('Reporting method with this name already exists', 409);
            }
            const method = reportingMethodRepository.create({
                name: name.trim(),
                createdBy: req.user?.username || 'system',
                updatedBy: req.user?.username || 'system',
            });
            const saved = await reportingMethodRepository.save(method);
            res.status(201).json(saved);
        }
        catch (error) {
            next(error);
        }
    });
    router.delete('/:id', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), async (req, res, next) => {
        try {
            const { id } = req.params;
            const method = await reportingMethodRepository.findById(id);
            if (!method) {
                throw new business_exception_1.BusinessException('Reporting method not found', 404);
            }
            await reportingMethodRepository.delete(id);
            res.status(200).json({ message: 'Reporting method deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    });
    return router;
};
exports.createReportingMethodsRoutes = createReportingMethodsRoutes;
//# sourceMappingURL=reporting-methods.routes.js.map