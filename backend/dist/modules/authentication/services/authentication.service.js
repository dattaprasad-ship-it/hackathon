"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const password_util_1 = require("../utils/password.util");
const jwt_util_1 = require("../utils/jwt.util");
const account_status_enum_1 = require("../../../constants/enums/account-status.enum");
const logger_1 = require("../../../utils/logger");
class AuthenticationService {
    constructor(userRepository, loginAttemptRepository, rateLimitService) {
        this.userRepository = userRepository;
        this.loginAttemptRepository = loginAttemptRepository;
        this.rateLimitService = rateLimitService;
    }
    async login(credentials, ipAddress) {
        const { username, password } = credentials;
        if (!username || !password) {
            const error = new Error('Username and password are required');
            error.statusCode = 400;
            throw error;
        }
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();
        if (!trimmedUsername || !trimmedPassword) {
            const error = new Error('Username and password cannot be empty');
            error.statusCode = 400;
            throw error;
        }
        const ipRateLimit = await this.rateLimitService.checkRateLimitByIp(ipAddress, 5, 15);
        if (!ipRateLimit.allowed) {
            await this.rateLimitService.recordAttempt({
                username: trimmedUsername,
                ipAddress,
                success: false,
                failureReason: 'Rate limit exceeded (IP)',
                attemptTimestamp: new Date(),
            });
            logger_1.logger.warn('Rate limit exceeded (IP)', {
                ipAddress,
                username: trimmedUsername,
                retryAfter: ipRateLimit.retryAfter,
            });
            const error = new Error('Too many login attempts. Please try again later.');
            error.statusCode = 429;
            error.retryAfter = ipRateLimit.retryAfter;
            throw error;
        }
        const usernameRateLimit = await this.rateLimitService.checkRateLimitByUsername(trimmedUsername, 10, 60);
        if (!usernameRateLimit.allowed) {
            await this.rateLimitService.recordAttempt({
                username: trimmedUsername,
                ipAddress,
                success: false,
                failureReason: 'Rate limit exceeded (username)',
                attemptTimestamp: new Date(),
            });
            logger_1.logger.warn('Rate limit exceeded (username)', {
                ipAddress,
                username: trimmedUsername,
                retryAfter: usernameRateLimit.retryAfter,
            });
            const error = new Error('Too many login attempts. Please try again later.');
            error.statusCode = 429;
            error.retryAfter = usernameRateLimit.retryAfter;
            throw error;
        }
        const user = await this.userRepository.findByUsername(trimmedUsername);
        if (!user) {
            await password_util_1.passwordUtil.verifyPassword(trimmedPassword, '$2b$10$dummyhash');
            await this.rateLimitService.recordAttempt({
                username: trimmedUsername,
                ipAddress,
                success: false,
                failureReason: 'Invalid credentials',
                attemptTimestamp: new Date(),
            });
            logger_1.logger.warn('Failed login attempt - invalid username', {
                ipAddress,
                username: trimmedUsername,
            });
            const error = new Error('Invalid username or password');
            error.statusCode = 401;
            throw error;
        }
        const isPasswordValid = await password_util_1.passwordUtil.verifyPassword(trimmedPassword, user.passwordHash);
        if (!isPasswordValid) {
            await this.rateLimitService.recordAttempt({
                username: trimmedUsername,
                ipAddress,
                success: false,
                failureReason: 'Invalid credentials',
                attemptTimestamp: new Date(),
            });
            logger_1.logger.warn('Failed login attempt - invalid password', {
                ipAddress,
                username: trimmedUsername,
                userId: user.id,
            });
            const error = new Error('Invalid username or password');
            error.statusCode = 401;
            throw error;
        }
        if (user.accountStatus !== account_status_enum_1.AccountStatus.ACTIVE) {
            await this.rateLimitService.recordAttempt({
                username: trimmedUsername,
                ipAddress,
                success: false,
                failureReason: `Account ${user.accountStatus.toLowerCase()}`,
                attemptTimestamp: new Date(),
            });
            logger_1.logger.warn('Failed login attempt - account not active', {
                ipAddress,
                username: trimmedUsername,
                userId: user.id,
                accountStatus: user.accountStatus,
            });
            const error = new Error(`Account is ${user.accountStatus.toLowerCase()}. Please contact administrator.`);
            error.statusCode = 403;
            throw error;
        }
        const token = jwt_util_1.jwtUtil.generateToken({
            id: user.id,
            username: user.username,
            role: user.role,
        });
        await this.userRepository.updateLastLogin(user.id, new Date());
        await this.rateLimitService.recordAttempt({
            username: trimmedUsername,
            ipAddress,
            success: true,
            attemptTimestamp: new Date(),
        });
        logger_1.logger.info('Successful login', {
            ipAddress,
            username: trimmedUsername,
            userId: user.id,
            role: user.role,
        });
        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                displayName: user.displayName,
            },
        };
    }
}
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map