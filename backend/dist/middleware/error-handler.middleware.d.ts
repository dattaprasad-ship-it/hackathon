import { Request, Response, NextFunction } from 'express';
import { BusinessException } from '../common/exceptions/business.exception';
export interface AppError extends Error {
    statusCode?: number;
    status?: number;
    code?: string;
}
export declare const errorHandler: (err: AppError | BusinessException, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=error-handler.middleware.d.ts.map