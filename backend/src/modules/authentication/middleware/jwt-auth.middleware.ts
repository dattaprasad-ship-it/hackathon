import { Request, Response, NextFunction } from 'express';
import { jwtUtil } from '../utils/jwt.util';
import { UserRepository } from '../repositories/user.repository';
import { AccountStatus } from '../../../constants/enums/account-status.enum';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export const jwtAuthMiddleware = (
  userRepository: UserRepository
) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const error: any = new Error('Authentication token required');
        error.statusCode = 401;
        throw error;
      }

      const token = authHeader.substring(7);

      const decoded = jwtUtil.verifyToken(token);

      const user = await userRepository.findById(decoded.id);

      if (!user) {
        const error: any = new Error('User not found');
        error.statusCode = 401;
        throw error;
      }

      if (user.accountStatus !== AccountStatus.ACTIVE) {
        const error: any = new Error('Account is not active');
        error.statusCode = 403;
        throw error;
      }

      req.user = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      next();
    } catch (error: any) {
      if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
        const authError: any = new Error('Invalid or expired token');
        authError.statusCode = 401;
        next(authError);
        return;
      }

      next(error);
    }
  };
};

