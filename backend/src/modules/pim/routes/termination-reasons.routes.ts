import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware, AuthenticatedRequest } from '../../authentication/middleware/jwt-auth.middleware';
import { UserRepository } from '../../authentication/repositories/user.repository';
import { Repository } from 'typeorm';
import { TerminationReason } from '../entities/termination-reason.entity';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { BusinessException } from '../../../common/exceptions/business.exception';

class TerminationReasonRepository extends IGenericRepository<TerminationReason> {
  constructor(repository: Repository<TerminationReason>) {
    super(repository);
  }
}

export const createTerminationReasonsRoutes = (
  terminationReasonRepository: TerminationReasonRepository,
  userRepository: UserRepository
): Router => {
  const router = Router();

  router.get('/', jwtAuthMiddleware(userRepository), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const reasons = await terminationReasonRepository.findAll();
      res.status(200).json({ data: reasons });
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

      const existing = await terminationReasonRepository.findOne({ where: { name: name.trim() } });
      if (existing) {
        throw new BusinessException('Termination reason with this name already exists', 409);
      }

      const reason = terminationReasonRepository.create({
        name: name.trim(),
        createdBy: req.user?.username || 'system',
        updatedBy: req.user?.username || 'system',
      });

      const saved = await terminationReasonRepository.save(reason);
      res.status(201).json(saved);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', jwtAuthMiddleware(userRepository), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const reason = await terminationReasonRepository.findById(id);
      if (!reason) {
        throw new BusinessException('Termination reason not found', 404);
      }

      await terminationReasonRepository.delete(id);
      res.status(200).json({ message: 'Termination reason deleted successfully' });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

