import { Router, Request, Response, NextFunction } from 'express';
import { loginValidation, validate } from '../validators/authentication.validator';
import { AuthenticationService } from '../services/authentication.service';
import { UserRepository } from '../repositories/user.repository';
import { jwtAuthMiddleware, AuthenticatedRequest } from '../middleware/jwt-auth.middleware';
import { LoginResponseDto } from '../dto/authentication.dto';

export const createAuthenticationRoutes = (
  authenticationService: AuthenticationService,
  userRepository: UserRepository
): Router => {
  const router = Router();

  router.post(
    '/login',
    loginValidation,
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result: LoginResponseDto = await authenticationService.login(req.body);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  router.get('/me', jwtAuthMiddleware(userRepository), (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({
      user: req.user,
    });
  });

  router.get('/validate', jwtAuthMiddleware(userRepository), (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({
      valid: true,
      user: req.user,
    });
  });

  router.post('/logout', jwtAuthMiddleware(userRepository), (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({
      message: 'Logged out successfully',
    });
  });

  return router;
};

