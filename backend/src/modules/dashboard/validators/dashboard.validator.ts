import { Request, Response, NextFunction } from 'express';
import { query, validationResult } from 'express-validator';
import { BusinessException } from '../../../common/exceptions/business.exception';

export const validateEmployeesOnLeaveQuery = [
  query('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BusinessException(
        `Validation failed: ${errors.array().map((e) => e.msg).join(', ')}`,
        400
      );
    }
    next();
  },
];

export const validateBuzzPostsQuery = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Limit must be between 1 and 20'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BusinessException(
        `Validation failed: ${errors.array().map((e) => e.msg).join(', ')}`,
        400
      );
    }
    next();
  },
];

