"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClaimsConfigRoutes = void 0;
const express_1 = require("express");
const jwt_auth_middleware_1 = require("../../authentication/middleware/jwt-auth.middleware");
const createClaimsConfigRoutes = (configService, userRepository) => {
    const router = (0, express_1.Router)();
    // GET /api/claims/config - Get configuration data
    router.get('/config', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), async (req, res, next) => {
        try {
            const config = await configService.getConfig();
            res.json(config);
        }
        catch (error) {
            next(error);
        }
    });
    return router;
};
exports.createClaimsConfigRoutes = createClaimsConfigRoutes;
//# sourceMappingURL=claims-config.routes.js.map