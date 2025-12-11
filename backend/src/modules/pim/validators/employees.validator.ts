import { body, query, ValidationChain, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { BusinessException } from '../../../common/exceptions/business.exception';

export const validateCreateEmployee: ValidationChain[] = [
  body('employeeId')
    .notEmpty()
    .withMessage('Employee ID is required')
    .isString()
    .withMessage('Employee ID must be a string')
    .trim(),
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isString()
    .withMessage('First name must be a string')
    .trim(),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isString()
    .withMessage('Last name must be a string')
    .trim(),
  body('middleName').optional().isString().trim(),
  body('jobTitleId').optional().isUUID().withMessage('Invalid job title ID'),
  body('employmentStatusId').optional().isUUID().withMessage('Invalid employment status ID'),
  body('subUnitId').optional().isUUID().withMessage('Invalid sub-unit ID'),
  body('supervisorId').optional().isUUID().withMessage('Invalid supervisor ID'),
  body('reportingMethodId').optional().isUUID().withMessage('Invalid reporting method ID'),
  body('profilePhotoPath').optional().isString(),
  body('createLoginDetails').optional().isBoolean(),
  body('username')
    .optional()
    .isString()
    .withMessage('Username must be a string')
    .trim()
    .custom((value, { req }) => {
      if (req.body.createLoginDetails && !value) {
        throw new BusinessException('Username is required when creating login details', 400, 'VALIDATION_ERROR');
      }
      return true;
    }),
  body('password')
    .optional()
    .isString()
    .withMessage('Password must be a string')
    .custom((value, { req }) => {
      if (req.body.createLoginDetails && !value) {
        throw new BusinessException('Password is required when creating login details', 400, 'VALIDATION_ERROR');
      }
      return true;
    }),
  body('confirmPassword')
    .optional()
    .isString()
    .withMessage('Confirm password must be a string')
    .custom((value, { req }) => {
      if (req.body.createLoginDetails && !value) {
        throw new BusinessException('Confirm password is required when creating login details', 400, 'VALIDATION_ERROR');
      }
      if (req.body.password && value !== req.body.password) {
        throw new BusinessException('Password and confirm password do not match', 400, 'VALIDATION_ERROR');
      }
      return true;
    }),
  body('loginStatus')
    .optional()
    .isIn(['Enabled', 'Disabled'])
    .withMessage('Login status must be either Enabled or Disabled'),
];

export const validateUpdateEmployee: ValidationChain[] = [
  body('employeeId').optional().isString().trim(),
  body('firstName').optional().isString().trim(),
  body('lastName').optional().isString().trim(),
  body('middleName').optional().isString().trim(),
  body('jobTitleId').optional().isUUID().withMessage('Invalid job title ID'),
  body('employmentStatusId').optional().isUUID().withMessage('Invalid employment status ID'),
  body('subUnitId').optional().isUUID().withMessage('Invalid sub-unit ID'),
  body('supervisorId').optional().isUUID().withMessage('Invalid supervisor ID'),
  body('reportingMethodId').optional().isUUID().withMessage('Invalid reporting method ID'),
  body('profilePhotoPath').optional().isString(),
  body('username').optional().isString().trim(),
  body('password').optional().isString(),
  body('loginStatus')
    .optional()
    .isIn(['Enabled', 'Disabled'])
    .withMessage('Login status must be either Enabled or Disabled'),
];

export const validateEmployeeListQuery: ValidationChain[] = [
  query('employeeName').optional().isString().trim(),
  query('employeeId').optional().isString().trim(),
  query('employmentStatusId').optional().isUUID().withMessage('Invalid employment status ID'),
  query('jobTitleId').optional().isUUID().withMessage('Invalid job title ID'),
  query('subUnitId').optional().isUUID().withMessage('Invalid sub-unit ID'),
  query('supervisorId').optional().isUUID().withMessage('Invalid supervisor ID'),
  query('include')
    .optional()
    .isIn(['current', 'all'])
    .withMessage('Include must be either "current" or "all"'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 500 }).withMessage('Limit must be between 1 and 500'),
  query('sortBy').optional().isString().trim(),
  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Sort order must be either ASC or DESC'),
];

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors.mapped() as any,
      },
    });
    return;
  }

  next();
};

