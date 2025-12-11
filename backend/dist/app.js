"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const error_handler_middleware_1 = require("./middleware/error-handler.middleware");
const request_logger_middleware_1 = require("./middleware/request-logger.middleware");
const authentication_routes_1 = require("./modules/authentication/routes/authentication.routes");
const authentication_service_1 = require("./modules/authentication/services/authentication.service");
const user_repository_1 = require("./modules/authentication/repositories/user.repository");
const login_attempt_repository_1 = require("./modules/authentication/repositories/login-attempt.repository");
const rate_limit_service_1 = require("./modules/authentication/services/rate-limit.service");
const database_1 = require("./config/database");
const user_entity_1 = require("./modules/authentication/entities/user.entity");
const login_attempt_entity_1 = require("./modules/authentication/entities/login-attempt.entity");
const dashboard_routes_1 = require("./modules/dashboard/routes/dashboard.routes");
const dashboard_service_1 = require("./modules/dashboard/services/dashboard.service");
const time_at_work_service_1 = require("./modules/dashboard/services/time-at-work.service");
const my_actions_service_1 = require("./modules/dashboard/services/my-actions.service");
const employees_on_leave_service_1 = require("./modules/dashboard/services/employees-on-leave.service");
const employee_distribution_service_1 = require("./modules/dashboard/services/employee-distribution.service");
const buzz_posts_service_1 = require("./modules/dashboard/services/buzz-posts.service");
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(request_logger_middleware_1.requestLogger);
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    const userRepository = new user_repository_1.UserRepository(database_1.AppDataSource.getRepository(user_entity_1.User));
    const loginAttemptRepository = new login_attempt_repository_1.LoginAttemptRepository(database_1.AppDataSource.getRepository(login_attempt_entity_1.LoginAttempt));
    const rateLimitService = new rate_limit_service_1.RateLimitService(loginAttemptRepository);
    const authenticationService = new authentication_service_1.AuthenticationService(userRepository, loginAttemptRepository, rateLimitService);
    const authRoutes = (0, authentication_routes_1.createAuthenticationRoutes)(authenticationService, userRepository);
    app.use('/api/auth', authRoutes);
    const timeAtWorkService = new time_at_work_service_1.TimeAtWorkService({
        findPunchInRecord: async () => null,
        findWeeklyHours: async () => [],
    });
    const myActionsService = new my_actions_service_1.MyActionsService({ countPendingTimesheets: async () => 0 }, { countPendingSelfReviews: async () => 0 }, { countScheduledInterviews: async () => 0 });
    const employeesOnLeaveService = new employees_on_leave_service_1.EmployeesOnLeaveService({
        findEmployeesOnLeave: async () => [],
    });
    const employeeDistributionService = new employee_distribution_service_1.EmployeeDistributionService({
        findEmployeesBySubUnit: async () => [],
    });
    const buzzPostsService = new buzz_posts_service_1.BuzzPostsService({
        findLatestPosts: async () => [],
    });
    const dashboardService = new dashboard_service_1.DashboardService(timeAtWorkService, myActionsService, employeesOnLeaveService, employeeDistributionService, buzzPostsService);
    const dashboardRoutes = (0, dashboard_routes_1.createDashboardRoutes)(dashboardService, userRepository);
    app.use('/api/dashboard', dashboardRoutes);
    app.use(error_handler_middleware_1.errorHandler);
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map