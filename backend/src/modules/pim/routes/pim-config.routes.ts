import { Router, Request, Response, NextFunction } from 'express';
import { PimConfigService } from '../services/pim-config.service';
import { jwtAuthMiddleware, AuthenticatedRequest } from '../../authentication/middleware/jwt-auth.middleware';
import { UserRepository } from '../../authentication/repositories/user.repository';
import { logger } from '../../../utils/logger';

export const createPimConfigRoutes = (
  pimConfigService: PimConfigService,
  userRepository: UserRepository
): Router => {
  const router = Router();

  router.use(jwtAuthMiddleware(userRepository));

  router.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const config = await pimConfigService.getConfig();
      res.status(200).json(config);
    } catch (error) {
      logger.error(`Error fetching PIM config: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      next(error);
    }
  });

  router.put('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const config = await pimConfigService.updateConfig(req.body, req.user?.username);
      res.status(200).json(config);
    } catch (error) {
      logger.error(`Error updating PIM config: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      next(error);
    }
  });

  return router;
};

