"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtAuthMiddleware = void 0;
const jwt_util_1 = require("../utils/jwt.util");
const account_status_enum_1 = require("../../../constants/enums/account-status.enum");
const jwtAuthMiddleware = (userRepository) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                const error = new Error('Authentication token required');
                error.statusCode = 401;
                throw error;
            }
            const token = authHeader.substring(7);
            const decoded = jwt_util_1.jwtUtil.verifyToken(token);
            const user = await userRepository.findById(decoded.id);
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 401;
                throw error;
            }
            if (user.accountStatus !== account_status_enum_1.AccountStatus.ACTIVE) {
                const error = new Error('Account is not active');
                error.statusCode = 403;
                throw error;
            }
            req.user = {
                id: user.id,
                username: user.username,
                role: user.role,
            };
            next();
        }
        catch (error) {
            if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
                const authError = new Error('Invalid or expired token');
                authError.statusCode = 401;
                next(authError);
                return;
            }
            next(error);
        }
    };
};
exports.jwtAuthMiddleware = jwtAuthMiddleware;
//# sourceMappingURL=jwt-auth.middleware.js.map