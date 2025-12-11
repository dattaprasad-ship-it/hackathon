import { Request, Response, NextFunction } from 'express';
import { BusinessException } from '../common/exceptions/business.exception';

export interface AppError extends Error {
  statusCode?: number;
  status?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError | BusinessException,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err instanceof BusinessException 
    ? err.statusCode 
    : err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  const code = err instanceof BusinessException
    ? err.code
    : err.code || 'INTERNAL_ERROR';

  const errorResponse = {
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  };

  res.status(statusCode).json(errorResponse);
};

