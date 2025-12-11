import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware, AuthenticatedRequest } from '../../authentication/middleware/jwt-auth.middleware';
import { UserRepository } from '../../authentication/repositories/user.repository';
import { ReportingMethodRepository } from '../repositories/lookup.repository';
import { ReportingMethod } from '../entities/reporting-method.entity';
import { BusinessException } from '../../../common/exceptions/business.exception';

export const createReportingMethodsRoutes = (
  reportingMethodRepository: ReportingMethodRepository,
  userRepository: UserRepository
): Router => {
  const router = Router();

  router.get('/', jwtAuthMiddleware(userRepository), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const methods = await reportingMethodRepository.findAll();
      res.status(200).json({ data: methods });
    } catch (error) {
      next(error);
    }
  });

  router.post('/', jwtAuthMiddleware(userRepository), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      if (!name || !name.trim()) {
        throw new BusinessException('Name is required', 400);
      }

      const existing = await reportingMethodRepository.findOne({ where: { name: name.trim() } });
      if (existing) {
        throw new BusinessException('Reporting method with this name already exists', 409);
      }

      const method = reportingMethodRepository.create({
        name: name.trim(),
        createdBy: req.user?.username || 'system',
        updatedBy: req.user?.username || 'system',
      });

      const saved = await reportingMethodRepository.save(method);
      res.status(201).json(saved);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', jwtAuthMiddleware(userRepository), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const method = await reportingMethodRepository.findById(id);
      if (!method) {
        throw new BusinessException('Reporting method not found', 404);
      }

      await reportingMethodRepository.delete(id);
      res.status(200).json({ message: 'Reporting method deleted successfully' });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

