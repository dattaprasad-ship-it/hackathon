import { Router, Request, Response, NextFunction } from 'express';
import { ReportsService } from '../services/reports.service';
import { jwtAuthMiddleware, AuthenticatedRequest } from '../../authentication/middleware/jwt-auth.middleware';
import { UserRepository } from '../../authentication/repositories/user.repository';
import { logger } from '../../../utils/logger';

export const createReportsRoutes = (
  reportsService: ReportsService,
  userRepository: UserRepository
): Router => {
  const router = Router();

  router.use(jwtAuthMiddleware(userRepository));

  router.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const reportName = req.query.reportName as string | undefined;
      const reports = await reportsService.findAll(reportName);
      res.status(200).json({ data: reports });
    } catch (error) {
      logger.error(`Error fetching reports: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      next(error);
    }
  });

  router.get('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const report = await reportsService.findOne(req.params.id);
      res.status(200).json(report);
    } catch (error) {
      logger.error(`Error fetching report ${req.params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      next(error);
    }
  });

  router.post('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const report = await reportsService.create(req.body, req.user?.username);
      res.status(201).json(report);
    } catch (error) {
      logger.error(`Error creating report: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      next(error);
    }
  });

  router.put('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const report = await reportsService.update(req.params.id, req.body, req.user?.username);
      res.status(200).json(report);
    } catch (error) {
      logger.error(`Error updating report ${req.params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      next(error);
    }
  });

  router.delete('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await reportsService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting report ${req.params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      next(error);
    }
  });

  router.post('/:id/execute', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await reportsService.executeReport(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      logger.error(`Error executing report ${req.params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      next(error);
    }
  });

  return router;
};

