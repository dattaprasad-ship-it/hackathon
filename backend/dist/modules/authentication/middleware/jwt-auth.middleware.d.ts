import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories/user.repository';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        username: string;
        role: string;
    };
}
export declare const jwtAuthMiddleware: (userRepository: UserRepository) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=jwt-auth.middleware.d.ts.map