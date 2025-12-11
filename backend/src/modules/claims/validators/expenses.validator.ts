import { body, param, ValidationChain } from 'express-validator';

export const validateClaimId: ValidationChain[] = [
  param('id')
    .notEmpty()
    .withMessage('Claim ID is required')
    .isString()
    .withMessage('Claim ID must be a string')
    .trim(),
];

export const validateExpenseId: ValidationChain[] = [
  param('expenseId')
    .notEmpty()
    .withMessage('Expense ID is required')
    .isString()
    .withMessage('Expense ID must be a string')
    .trim(),
];

export const validateCreateExpense: ValidationChain[] = [
  body('expenseTypeId')
    .notEmpty()
    .withMessage('Expense type ID is required')
    .isString()
    .withMessage('Expense type ID must be a string')
    .trim(),
  body('expenseDate')
    .notEmpty()
    .withMessage('Expense date is required')
    .isISO8601()
    .withMessage('Invalid expense date format'),
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0')
    .custom((value) => {
      const decimalPlaces = (value.toString().split('.')[1] || '').length;
      if (decimalPlaces > 2) {
        throw new Error('Amount cannot have more than 2 decimal places');
      }
      return true;
    }),
  body('note').optional().isString().trim(),
];

export const validateUpdateExpense: ValidationChain[] = [
  body('expenseTypeId').optional().isString().trim(),
  body('expenseDate').optional().isISO8601().withMessage('Invalid expense date format'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0')
    .custom((value) => {
      if (value !== undefined) {
        const decimalPlaces = (value.toString().split('.')[1] || '').length;
        if (decimalPlaces > 2) {
          throw new Error('Amount cannot have more than 2 decimal places');
        }
      }
      return true;
    }),
  body('note').optional().isString().trim(),
];

