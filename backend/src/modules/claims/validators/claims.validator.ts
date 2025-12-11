import { body, query, param, ValidationChain } from 'express-validator';

export const validateCreateClaim: ValidationChain[] = [
  body('employeeId')
    .notEmpty()
    .withMessage('Employee ID is required')
    .isString()
    .withMessage('Employee ID must be a string')
    .trim(),
  body('eventTypeId')
    .notEmpty()
    .withMessage('Event type ID is required')
    .isString()
    .withMessage('Event type ID must be a string')
    .trim(),
  body('currencyId')
    .notEmpty()
    .withMessage('Currency ID is required')
    .isString()
    .withMessage('Currency ID must be a string')
    .trim(),
  body('remarks').optional().isString().trim(),
];

export const validateUpdateClaim: ValidationChain[] = [
  body('eventTypeId').optional().isString().trim(),
  body('currencyId').optional().isString().trim(),
  body('remarks').optional().isString().trim(),
];

export const validateClaimSearch: ValidationChain[] = [
  query('employeeName').optional().isString().trim(),
  query('referenceId').optional().isString().trim(),
  query('eventTypeId').optional().isString().trim(),
  query('status').optional().isString().trim(),
  query('include')
    .optional()
    .isIn(['current_employees_only', 'past_employees_only', 'all_employees', 'active_claims_only', 'closed_claims_only', 'pending_payment'])
    .withMessage('Invalid include filter value'),
  query('fromDate').optional().isISO8601().withMessage('Invalid from date format'),
  query('toDate').optional().isISO8601().withMessage('Invalid to date format'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isString().trim(),
  query('sortOrder').optional().isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC'),
];

export const validateClaimId: ValidationChain[] = [
  param('id')
    .notEmpty()
    .withMessage('Claim ID is required')
    .isString()
    .withMessage('Claim ID must be a string')
    .trim(),
];

export const validateRejectClaim: ValidationChain[] = [
  body('rejectionReason')
    .notEmpty()
    .withMessage('Rejection reason is required')
    .isString()
    .withMessage('Rejection reason must be a string')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Rejection reason must be between 1 and 1000 characters'),
];

