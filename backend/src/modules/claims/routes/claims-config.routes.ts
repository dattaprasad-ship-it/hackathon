import { Router, Response, NextFunction } from 'express';
import { ClaimsConfigService } from '../services/claims-config.service';
import { UserRepository } from '../../authentication/repositories/user.repository';
import { jwtAuthMiddleware, AuthenticatedRequest } from '../../authentication/middleware/jwt-auth.middleware';

export const createClaimsConfigRoutes = (
  configService: ClaimsConfigService,
  userRepository: UserRepository
): Router => {
  const router = Router();

  // GET /api/claims/config - Get configuration data
  router.get(
    '/config',
    jwtAuthMiddleware(userRepository),
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const config = await configService.getConfig();
        res.json(config);
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
};

