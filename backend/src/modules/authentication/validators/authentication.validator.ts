import { body, ValidationChain, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ErrorResponseDto } from '../dto/authentication.dto';

export const loginValidation: ValidationChain[] = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Username must be between 1 and 255 characters'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Password must be between 1 and 255 characters'),
];

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorResponse: ErrorResponseDto = {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors.mapped() as any,
      },
    };

    res.status(400).json(errorResponse);
    return;
  }

  next();
};

