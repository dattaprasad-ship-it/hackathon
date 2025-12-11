import { Router, Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { jwtAuthMiddleware, AuthenticatedRequest } from '../../authentication/middleware/jwt-auth.middleware';
import { UserRepository } from '../../authentication/repositories/user.repository';
import { validateEmployeesOnLeaveQuery } from '../validators/dashboard.validator';
import { validateBuzzPostsQuery } from '../validators/dashboard.validator';
import { logger } from '../../../utils/logger';

export const createDashboardRoutes = (
  dashboardService: DashboardService,
  userRepository: UserRepository
): Router => {
  const router = Router();

  const authMiddleware = jwtAuthMiddleware(userRepository);

  router.get(
    '/time-at-work',
    authMiddleware,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      try {
        const user = req.user!;
        const data = await dashboardService.getTimeAtWork(user);
        const responseTime = Date.now() - startTime;

        logger.info('Dashboard API request', {
          userId: user.id,
          endpoint: '/time-at-work',
          responseTime,
        });

        res.status(200).json(data);
      } catch (error) {
        next(error);
      }
    }
  );

  router.get(
    '/my-actions',
    authMiddleware,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      try {
        const user = req.user!;
        const data = await dashboardService.getMyActions(user);
        const responseTime = Date.now() - startTime;

        logger.info('Dashboard API request', {
          userId: user.id,
          endpoint: '/my-actions',
          responseTime,
        });

        res.status(200).json(data);
      } catch (error) {
        next(error);
      }
    }
  );

  router.get(
    '/employees-on-leave',
    authMiddleware,
    validateEmployeesOnLeaveQuery,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      try {
        const user = req.user!;
        const date = req.query.date as string | undefined;
        const data = await dashboardService.getEmployeesOnLeave(user, date);
        const responseTime = Date.now() - startTime;

        logger.info('Dashboard API request', {
          userId: user.id,
          endpoint: '/employees-on-leave',
          responseTime,
        });

        res.status(200).json(data);
      } catch (error) {
        next(error);
      }
    }
  );

  router.get(
    '/employee-distribution',
    authMiddleware,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      try {
        const user = req.user!;
        const data = await dashboardService.getEmployeeDistribution(user);
        const responseTime = Date.now() - startTime;

        logger.info('Dashboard API request', {
          userId: user.id,
          endpoint: '/employee-distribution',
          responseTime,
        });

        res.status(200).json(data);
      } catch (error) {
        next(error);
      }
    }
  );

  router.get(
    '/buzz/latest',
    authMiddleware,
    validateBuzzPostsQuery,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      try {
        const user = req.user!;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
        const data = await dashboardService.getBuzzPosts(user, limit);
        const responseTime = Date.now() - startTime;

        logger.info('Dashboard API request', {
          userId: user.id,
          endpoint: '/buzz/latest',
          responseTime,
        });

        res.status(200).json(data);
      } catch (error) {
        next(error);
      }
    }
  );

  router.get(
    '/summary',
    authMiddleware,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      try {
        const user = req.user!;
        const data = await dashboardService.getDashboardSummary(user);
        const responseTime = Date.now() - startTime;

        logger.info('Dashboard API request', {
          userId: user.id,
          endpoint: '/summary',
          responseTime,
        });

        res.status(200).json(data);
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
};

