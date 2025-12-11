import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/error-handler.middleware';
import { requestLogger } from './middleware/request-logger.middleware';
import { createAuthenticationRoutes } from './modules/authentication/routes/authentication.routes';
import { AuthenticationService } from './modules/authentication/services/authentication.service';
import { UserRepository } from './modules/authentication/repositories/user.repository';
import { AppDataSource } from './config/database';
import { User } from './modules/authentication/entities/user.entity';
import { createDashboardRoutes } from './modules/dashboard/routes/dashboard.routes';
import { DashboardService } from './modules/dashboard/services/dashboard.service';
import { TimeAtWorkService } from './modules/dashboard/services/time-at-work.service';
import { MyActionsService } from './modules/dashboard/services/my-actions.service';
import { EmployeesOnLeaveService } from './modules/dashboard/services/employees-on-leave.service';
import { EmployeeDistributionService } from './modules/dashboard/services/employee-distribution.service';
import { BuzzPostsService } from './modules/dashboard/services/buzz-posts.service';
import { createEmployeesRoutes } from './modules/pim/routes/employees.routes';
import { EmployeesService } from './modules/pim/services/employees.service';
import { EmployeeRepository } from './modules/pim/repositories/employee.repository';
import {
  JobTitleRepository,
  EmploymentStatusRepository,
  SubUnitRepository,
  ReportingMethodRepository,
} from './modules/pim/repositories/lookup.repository';
import { Employee } from './modules/pim/entities/employee.entity';
import { JobTitle } from './modules/pim/entities/job-title.entity';
import { EmploymentStatus } from './modules/pim/entities/employment-status.entity';
import { SubUnit } from './modules/pim/entities/sub-unit.entity';
import { ReportingMethod } from './modules/pim/entities/reporting-method.entity';
import { Report } from './modules/pim/entities/report.entity';
import { CustomField } from './modules/pim/entities/custom-field.entity';
import { PimConfig } from './modules/pim/entities/pim-config.entity';
import { createReportsRoutes } from './modules/pim/routes/reports.routes';
import { ReportsService } from './modules/pim/services/reports.service';
import { ReportRepository } from './modules/pim/repositories/report.repository';
import { createCustomFieldsRoutes } from './modules/pim/routes/custom-fields.routes';
import { CustomFieldsService } from './modules/pim/services/custom-fields.service';
import { CustomFieldRepository } from './modules/pim/repositories/custom-field.repository';
import { createPimConfigRoutes } from './modules/pim/routes/pim-config.routes';
import { PimConfigService } from './modules/pim/services/pim-config.service';
import { PimConfigRepository } from './modules/pim/repositories/pim-config.repository';
import { createDataImportRoutes } from './modules/pim/routes/data-import.routes';
import { DataImportService } from './modules/pim/services/data-import.service';
import { createReportingMethodsRoutes } from './modules/pim/routes/reporting-methods.routes';
import { createTerminationReasonsRoutes } from './modules/pim/routes/termination-reasons.routes';
import { TerminationReason } from './modules/pim/entities/termination-reason.entity';
import { Repository } from 'typeorm';
import { IGenericRepository } from './common/base/IGenericRepository';

export const createApp = (): Express => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const userRepository = new UserRepository(AppDataSource.getRepository(User));
  const authenticationService = new AuthenticationService(userRepository);

  const authRoutes = createAuthenticationRoutes(authenticationService, userRepository);
  app.use('/api/auth', authRoutes);

  const timeAtWorkService = new TimeAtWorkService({
    findPunchInRecord: async () => null,
    findWeeklyHours: async () => [],
  });
  const myActionsService = new MyActionsService(
    { countPendingTimesheets: async () => 0 },
    { countPendingSelfReviews: async () => 0 },
    { countScheduledInterviews: async () => 0 }
  );
  const employeesOnLeaveService = new EmployeesOnLeaveService({
    findEmployeesOnLeave: async () => [],
  });
  const employeeDistributionService = new EmployeeDistributionService({
    findEmployeesBySubUnit: async () => [],
  });
  const buzzPostsService = new BuzzPostsService({
    findLatestPosts: async () => [],
  });

  const dashboardService = new DashboardService(
    timeAtWorkService,
    myActionsService,
    employeesOnLeaveService,
    employeeDistributionService,
    buzzPostsService
  );

  const dashboardRoutes = createDashboardRoutes(dashboardService, userRepository);
  app.use('/api/dashboard', dashboardRoutes);

  const employeeRepository = new EmployeeRepository(AppDataSource.getRepository(Employee));
  const jobTitleRepository = new JobTitleRepository(AppDataSource.getRepository(JobTitle));
  const employmentStatusRepository = new EmploymentStatusRepository(
    AppDataSource.getRepository(EmploymentStatus)
  );
  const subUnitRepository = new SubUnitRepository(AppDataSource.getRepository(SubUnit));
  const reportingMethodRepository = new ReportingMethodRepository(
    AppDataSource.getRepository(ReportingMethod)
  );

  const employeesService = new EmployeesService(
    employeeRepository,
    jobTitleRepository,
    employmentStatusRepository,
    subUnitRepository,
    reportingMethodRepository
  );

  const employeesRoutes = createEmployeesRoutes(employeesService, userRepository);
  app.use('/api/employees', employeesRoutes);

  const reportRepository = new ReportRepository(AppDataSource.getRepository(Report));
  const reportsService = new ReportsService(reportRepository, employeeRepository);
  const reportsRoutes = createReportsRoutes(reportsService, userRepository);
  app.use('/api/reports', reportsRoutes);

  const customFieldRepository = new CustomFieldRepository(AppDataSource.getRepository(CustomField));
  const customFieldsService = new CustomFieldsService(customFieldRepository);
  const customFieldsRoutes = createCustomFieldsRoutes(customFieldsService, userRepository);
  app.use('/api/custom-fields', customFieldsRoutes);

  const pimConfigRepository = new PimConfigRepository(AppDataSource.getRepository(PimConfig));
  const pimConfigService = new PimConfigService(pimConfigRepository);
  const pimConfigRoutes = createPimConfigRoutes(pimConfigService, userRepository);
  app.use('/api/pim/config', pimConfigRoutes);

  const dataImportService = new DataImportService(employeeRepository);
  const dataImportRoutes = createDataImportRoutes(dataImportService, userRepository);
  app.use('/api/pim/import', dataImportRoutes);

  const reportingMethodsRoutes = createReportingMethodsRoutes(reportingMethodRepository, userRepository);
  app.use('/api/reporting-methods', reportingMethodsRoutes);

  const terminationReasonRepository = new (class extends IGenericRepository<TerminationReason> {
    constructor(repository: Repository<TerminationReason>) {
      super(repository);
    }
  })(AppDataSource.getRepository(TerminationReason));
  const terminationReasonsRoutes = createTerminationReasonsRoutes(terminationReasonRepository, userRepository);
  app.use('/api/termination-reasons', terminationReasonsRoutes);

  app.use(errorHandler);

  return app;
};
