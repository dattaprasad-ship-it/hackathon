"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomFieldsRoutes = void 0;
const express_1 = require("express");
const jwt_auth_middleware_1 = require("../../authentication/middleware/jwt-auth.middleware");
const logger_1 = require("../../../utils/logger");
const createCustomFieldsRoutes = (customFieldsService, userRepository) => {
    const router = (0, express_1.Router)();
    router.use((0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository));
    router.get('/', async (req, res, next) => {
        try {
            const fields = await customFieldsService.findAll();
            const remaining = await customFieldsService.getRemainingCount();
            res.status(200).json({ data: fields, remaining });
        }
        catch (error) {
            logger_1.logger.error(`Error fetching custom fields: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
            next(error);
        }
    });
    router.get('/:id', async (req, res, next) => {
        try {
            const field = await customFieldsService.findOne(req.params.id);
            res.status(200).json(field);
        }
        catch (error) {
            logger_1.logger.error(`Error fetching custom field ${req.params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
            next(error);
        }
    });
    router.post('/', async (req, res, next) => {
        try {
            const field = await customFieldsService.create(req.body, req.user?.username);
            res.status(201).json(field);
        }
        catch (error) {
            logger_1.logger.error(`Error creating custom field: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
            next(error);
        }
    });
    router.put('/:id', async (req, res, next) => {
        try {
            const field = await customFieldsService.update(req.params.id, req.body, req.user?.username);
            res.status(200).json(field);
        }
        catch (error) {
            logger_1.logger.error(`Error updating custom field ${req.params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
            next(error);
        }
    });
    router.delete('/:id', async (req, res, next) => {
        try {
            await customFieldsService.delete(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            logger_1.logger.error(`Error deleting custom field ${req.params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
            next(error);
        }
    });
    return router;
};
exports.createCustomFieldsRoutes = createCustomFieldsRoutes;
//# sourceMappingURL=custom-fields.routes.js.map