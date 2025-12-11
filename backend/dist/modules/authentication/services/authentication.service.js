"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const password_util_1 = require("../utils/password.util");
const jwt_util_1 = require("../utils/jwt.util");
const account_status_enum_1 = require("../../../constants/enums/account-status.enum");
const business_exception_1 = require("../../../common/exceptions/business.exception");
class AuthenticationService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async login(credentials) {
        const { username, password } = credentials;
        if (!username || !password) {
            throw new business_exception_1.BusinessException('Username and password are required', 400);
        }
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();
        if (!trimmedUsername || !trimmedPassword) {
            throw new business_exception_1.BusinessException('Username and password cannot be empty', 400);
        }
        const user = await this.userRepository.findByUsername(trimmedUsername);
        if (!user) {
            throw new business_exception_1.BusinessException('Invalid username or password', 401);
        }
        const isPasswordValid = await password_util_1.passwordUtil.verifyPassword(trimmedPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new business_exception_1.BusinessException('Invalid username or password', 401);
        }
        if (user.accountStatus !== account_status_enum_1.AccountStatus.ACTIVE) {
            throw new business_exception_1.BusinessException(`Account is ${user.accountStatus.toLowerCase()}. Please contact administrator.`, 403);
        }
        const token = jwt_util_1.jwtUtil.generateToken({
            id: user.id,
            username: user.username,
            role: user.role,
        });
        await this.userRepository.updateLastLogin(user.id, new Date());
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