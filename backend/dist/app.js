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
const database_1 = require("./config/database");
const user_entity_1 = require("./modules/authentication/entities/user.entity");
const dashboard_routes_1 = require("./modules/dashboard/routes/dashboard.routes");
const dashboard_service_1 = require("./modules/dashboard/services/dashboard.service");
const time_at_work_service_1 = require("./modules/dashboard/services/time-at-work.service");
const my_actions_service_1 = require("./modules/dashboard/services/my-actions.service");
const employees_on_leave_service_1 = require("./modules/dashboard/services/employees-on-leave.service");
const employee_distribution_service_1 = require("./modules/dashboard/services/employee-distribution.service");
const buzz_posts_service_1 = require("./modules/dashboard/services/buzz-posts.service");
const employees_routes_1 = require("./modules/pim/routes/employees.routes");
const employees_service_1 = require("./modules/pim/services/employees.service");
const employee_repository_1 = require("./modules/pim/repositories/employee.repository");
const lookup_repository_1 = require("./modules/pim/repositories/lookup.repository");
const employee_entity_1 = require("./modules/pim/entities/employee.entity");
const job_title_entity_1 = require("./modules/pim/entities/job-title.entity");
const employment_status_entity_1 = require("./modules/pim/entities/employment-status.entity");
const sub_unit_entity_1 = require("./modules/pim/entities/sub-unit.entity");
const reporting_method_entity_1 = require("./modules/pim/entities/reporting-method.entity");
const report_entity_1 = require("./modules/pim/entities/report.entity");
const custom_field_entity_1 = require("./modules/pim/entities/custom-field.entity");
const pim_config_entity_1 = require("./modules/pim/entities/pim-config.entity");
const reports_routes_1 = require("./modules/pim/routes/reports.routes");
const reports_service_1 = require("./modules/pim/services/reports.service");
const report_repository_1 = require("./modules/pim/repositories/report.repository");
const custom_fields_routes_1 = require("./modules/pim/routes/custom-fields.routes");
const custom_fields_service_1 = require("./modules/pim/services/custom-fields.service");
const custom_field_repository_1 = require("./modules/pim/repositories/custom-field.repository");
const pim_config_routes_1 = require("./modules/pim/routes/pim-config.routes");
const pim_config_service_1 = require("./modules/pim/services/pim-config.service");
const pim_config_repository_1 = require("./modules/pim/repositories/pim-config.repository");
const data_import_routes_1 = require("./modules/pim/routes/data-import.routes");
const data_import_service_1 = require("./modules/pim/services/data-import.service");
const reporting_methods_routes_1 = require("./modules/pim/routes/reporting-methods.routes");
const termination_reasons_routes_1 = require("./modules/pim/routes/termination-reasons.routes");
const termination_reason_entity_1 = require("./modules/pim/entities/termination-reason.entity");
const IGenericRepository_1 = require("./common/base/IGenericRepository");
const claims_routes_1 = require("./modules/claims/routes/claims.routes");
const expenses_routes_1 = require("./modules/claims/routes/expenses.routes");
const attachments_routes_1 = require("./modules/claims/routes/attachments.routes");
const claims_config_routes_1 = require("./modules/claims/routes/claims-config.routes");
const claims_service_1 = require("./modules/claims/services/claims.service");
const expenses_service_1 = require("./modules/claims/services/expenses.service");
const attachments_service_1 = require("./modules/claims/services/attachments.service");
const claims_config_service_1 = require("./modules/claims/services/claims-config.service");
const claim_repository_1 = require("./modules/claims/repositories/claim.repository");
const expense_repository_1 = require("./modules/claims/repositories/expense.repository");
const attachment_repository_1 = require("./modules/claims/repositories/attachment.repository");
const event_type_repository_1 = require("./modules/claims/repositories/event-type.repository");
const expense_type_repository_1 = require("./modules/claims/repositories/expense-type.repository");
const currency_repository_1 = require("./modules/claims/repositories/currency.repository");
const claim_entity_1 = require("./modules/claims/entities/claim.entity");
const expense_entity_1 = require("./modules/claims/entities/expense.entity");
const attachment_entity_1 = require("./modules/claims/entities/attachment.entity");
const event_type_entity_1 = require("./modules/claims/entities/event-type.entity");
const expense_type_entity_1 = require("./modules/claims/entities/expense-type.entity");
const currency_entity_1 = require("./modules/claims/entities/currency.entity");
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
    const authenticationService = new authentication_service_1.AuthenticationService(userRepository);
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
    const employeeRepository = new employee_repository_1.EmployeeRepository(database_1.AppDataSource.getRepository(employee_entity_1.Employee));
    const jobTitleRepository = new lookup_repository_1.JobTitleRepository(database_1.AppDataSource.getRepository(job_title_entity_1.JobTitle));
    const employmentStatusRepository = new lookup_repository_1.EmploymentStatusRepository(database_1.AppDataSource.getRepository(employment_status_entity_1.EmploymentStatus));
    const subUnitRepository = new lookup_repository_1.SubUnitRepository(database_1.AppDataSource.getRepository(sub_unit_entity_1.SubUnit));
    const reportingMethodRepository = new lookup_repository_1.ReportingMethodRepository(database_1.AppDataSource.getRepository(reporting_method_entity_1.ReportingMethod));
    const employeesService = new employees_service_1.EmployeesService(employeeRepository, jobTitleRepository, employmentStatusRepository, subUnitRepository, reportingMethodRepository);
    const employeesRoutes = (0, employees_routes_1.createEmployeesRoutes)(employeesService, userRepository);
    app.use('/api/employees', employeesRoutes);
    const reportRepository = new report_repository_1.ReportRepository(database_1.AppDataSource.getRepository(report_entity_1.Report));
    const reportsService = new reports_service_1.ReportsService(reportRepository, employeeRepository);
    const reportsRoutes = (0, reports_routes_1.createReportsRoutes)(reportsService, userRepository);
    app.use('/api/reports', reportsRoutes);
    const customFieldRepository = new custom_field_repository_1.CustomFieldRepository(database_1.AppDataSource.getRepository(custom_field_entity_1.CustomField));
    const customFieldsService = new custom_fields_service_1.CustomFieldsService(customFieldRepository);
    const customFieldsRoutes = (0, custom_fields_routes_1.createCustomFieldsRoutes)(customFieldsService, userRepository);
    app.use('/api/custom-fields', customFieldsRoutes);
    const pimConfigRepository = new pim_config_repository_1.PimConfigRepository(database_1.AppDataSource.getRepository(pim_config_entity_1.PimConfig));
    const pimConfigService = new pim_config_service_1.PimConfigService(pimConfigRepository);
    const pimConfigRoutes = (0, pim_config_routes_1.createPimConfigRoutes)(pimConfigService, userRepository);
    app.use('/api/pim/config', pimConfigRoutes);
    const dataImportService = new data_import_service_1.DataImportService(employeeRepository);
    const dataImportRoutes = (0, data_import_routes_1.createDataImportRoutes)(dataImportService, userRepository);
    app.use('/api/pim/import', dataImportRoutes);
    const reportingMethodsRoutes = (0, reporting_methods_routes_1.createReportingMethodsRoutes)(reportingMethodRepository, userRepository);
    app.use('/api/reporting-methods', reportingMethodsRoutes);
    const terminationReasonRepository = new (class extends IGenericRepository_1.IGenericRepository {
        constructor(repository) {
            super(repository);
        }
    })(database_1.AppDataSource.getRepository(termination_reason_entity_1.TerminationReason));
    const terminationReasonsRoutes = (0, termination_reasons_routes_1.createTerminationReasonsRoutes)(terminationReasonRepository, userRepository);
    app.use('/api/termination-reasons', terminationReasonsRoutes);
    // Claims module routes
    const claimRepository = new claim_repository_1.ClaimRepository(database_1.AppDataSource.getRepository(claim_entity_1.Claim));
    const expenseRepository = new expense_repository_1.ExpenseRepository(database_1.AppDataSource.getRepository(expense_entity_1.Expense));
    const attachmentRepository = new attachment_repository_1.AttachmentRepository(database_1.AppDataSource.getRepository(attachment_entity_1.Attachment));
    const eventTypeRepository = new event_type_repository_1.EventTypeRepository(database_1.AppDataSource.getRepository(event_type_entity_1.EventType));
    const expenseTypeRepository = new expense_type_repository_1.ExpenseTypeRepository(database_1.AppDataSource.getRepository(expense_type_entity_1.ExpenseType));
    const currencyRepository = new currency_repository_1.CurrencyRepository(database_1.AppDataSource.getRepository(currency_entity_1.Currency));
    const claimsService = new claims_service_1.ClaimsService(claimRepository, employeeRepository, eventTypeRepository, currencyRepository, expenseRepository);
    const expensesService = new expenses_service_1.ExpensesService(expenseRepository, claimRepository, expenseTypeRepository);
    const attachmentsService = new attachments_service_1.AttachmentsService(attachmentRepository, claimRepository);
    const claimsConfigService = new claims_config_service_1.ClaimsConfigService(eventTypeRepository, expenseTypeRepository, currencyRepository);
    const claimsRoutes = (0, claims_routes_1.createClaimsRoutes)(claimsService, userRepository);
    app.use('/api/claims', claimsRoutes);
    const expensesRoutes = (0, expenses_routes_1.createExpensesRoutes)(expensesService, userRepository);
    app.use('/api/claims', expensesRoutes);
    const attachmentsRoutes = (0, attachments_routes_1.createAttachmentsRoutes)(attachmentsService, userRepository);
    app.use('/api/claims', attachmentsRoutes);
    const claimsConfigRoutes = (0, claims_config_routes_1.createClaimsConfigRoutes)(claimsConfigService, userRepository);
    app.use('/api/claims', claimsConfigRoutes);
    app.use(error_handler_middleware_1.errorHandler);
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map