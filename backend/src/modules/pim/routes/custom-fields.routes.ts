import { Router, Request, Response, NextFunction } from 'express';
import { CustomFieldsService } from '../services/custom-fields.service';
import { jwtAuthMiddleware, AuthenticatedRequest } from '../../authentication/middleware/jwt-auth.middleware';
import { UserRepository } from '../../authentication/repositories/user.repository';
import { logger } from '../../../utils/logger';

export const createCustomFieldsRoutes = (
  customFieldsService: CustomFieldsService,
  userRepository: UserRepository
): Router => {
  const router = Router();

  router.use(jwtAuthMiddleware(userRepository));

  router.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const fields = await customFieldsService.findAll();
      const remaining = await customFieldsService.getRemainingCount();
      res.status(200).json({ data: fields, remaining });
    } catch (error) {
      logger.error(`Error fetching custom fields: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      next(error);
    }
  });

  router.get('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const field = await customFieldsService.findOne(req.params.id);
      res.status(200).json(field);
    } catch (error) {
      logger.error(`Error fetching custom field ${req.params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      next(error);
    }
  });

  router.post('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const field = await customFieldsService.create(req.body, req.user?.username);
      res.status(201).json(field);
    } catch (error) {
      logger.error(`Error creating custom field: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      next(error);
    }
  });

  router.put('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const field = await customFieldsService.update(req.params.id, req.body, req.user?.username);
      res.status(200).json(field);
    } catch (error) {
      logger.error(`Error updating custom field ${req.params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      next(error);
    }
  });

  router.delete('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await customFieldsService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting custom field ${req.params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      next(error);
    }
  });

  return router;
};

