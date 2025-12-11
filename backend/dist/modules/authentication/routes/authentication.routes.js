"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthenticationRoutes = void 0;
const express_1 = require("express");
const authentication_validator_1 = require("../validators/authentication.validator");
const jwt_auth_middleware_1 = require("../middleware/jwt-auth.middleware");
const createAuthenticationRoutes = (authenticationService, userRepository) => {
    const router = (0, express_1.Router)();
    router.post('/login', authentication_validator_1.loginValidation, authentication_validator_1.validate, async (req, res, next) => {
        try {
            const result = await authenticationService.login(req.body);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    });
    router.get('/me', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), (req, res) => {
        res.status(200).json({
            user: req.user,
        });
    });
    router.get('/validate', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), (req, res) => {
        res.status(200).json({
            valid: true,
            user: req.user,
        });
    });
    router.post('/logout', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), (req, res) => {
        res.status(200).json({
            message: 'Logged out successfully',
        });
    });
    return router;
};
exports.createAuthenticationRoutes = createAuthenticationRoutes;
//# sourceMappingURL=authentication.routes.js.map