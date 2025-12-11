"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTerminationReasonsRoutes = void 0;
const express_1 = require("express");
const jwt_auth_middleware_1 = require("../../authentication/middleware/jwt-auth.middleware");
const IGenericRepository_1 = require("../../../common/base/IGenericRepository");
const business_exception_1 = require("../../../common/exceptions/business.exception");
class TerminationReasonRepository extends IGenericRepository_1.IGenericRepository {
    constructor(repository) {
        super(repository);
    }
}
const createTerminationReasonsRoutes = (terminationReasonRepository, userRepository) => {
    const router = (0, express_1.Router)();
    router.get('/', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), async (req, res, next) => {
        try {
            const reasons = await terminationReasonRepository.findAll();
            res.status(200).json({ data: reasons });
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
            const existing = await terminationReasonRepository.findOne({ where: { name: name.trim() } });
            if (existing) {
                throw new business_exception_1.BusinessException('Termination reason with this name already exists', 409);
            }
            const reason = terminationReasonRepository.create({
                name: name.trim(),
                createdBy: req.user?.username || 'system',
                updatedBy: req.user?.username || 'system',
            });
            const saved = await terminationReasonRepository.save(reason);
            res.status(201).json(saved);
        }
        catch (error) {
            next(error);
        }
    });
    router.delete('/:id', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), async (req, res, next) => {
        try {
            const { id } = req.params;
            const reason = await terminationReasonRepository.findById(id);
            if (!reason) {
                throw new business_exception_1.BusinessException('Termination reason not found', 404);
            }
            await terminationReasonRepository.delete(id);
            res.status(200).json({ message: 'Termination reason deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    });
    return router;
};
exports.createTerminationReasonsRoutes = createTerminationReasonsRoutes;
//# sourceMappingURL=termination-reasons.routes.js.map