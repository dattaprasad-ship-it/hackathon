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

  app.use(errorHandler);

  return app;
};
