"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPimConfigRoutes = void 0;
const express_1 = require("express");
const jwt_auth_middleware_1 = require("../../authentication/middleware/jwt-auth.middleware");
const logger_1 = require("../../../utils/logger");
const createPimConfigRoutes = (pimConfigService, userRepository) => {
    const router = (0, express_1.Router)();
    router.use((0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository));
    router.get('/', async (req, res, next) => {
        try {
            const config = await pimConfigService.getConfig();
            res.status(200).json(config);
        }
        catch (error) {
            logger_1.logger.error(`Error fetching PIM config: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
            next(error);
        }
    });
    router.put('/', async (req, res, next) => {
        try {
            const config = await pimConfigService.updateConfig(req.body, req.user?.username);
            res.status(200).json(config);
        }
        catch (error) {
            logger_1.logger.error(`Error updating PIM config: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
            next(error);
        }
    });
    return router;
};
exports.createPimConfigRoutes = createPimConfigRoutes;
//# sourceMappingURL=pim-config.routes.js.map