"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateExpense = exports.validateCreateExpense = exports.validateExpenseId = exports.validateClaimId = void 0;
const express_validator_1 = require("express-validator");
exports.validateClaimId = [
    (0, express_validator_1.param)('id')
        .notEmpty()
        .withMessage('Claim ID is required')
        .isString()
        .withMessage('Claim ID must be a string')
        .trim(),
];
exports.validateExpenseId = [
    (0, express_validator_1.param)('expenseId')
        .notEmpty()
        .withMessage('Expense ID is required')
        .isString()
        .withMessage('Expense ID must be a string')
        .trim(),
];
exports.validateCreateExpense = [
    (0, express_validator_1.body)('expenseTypeId')
        .notEmpty()
        .withMessage('Expense type ID is required')
        .isString()
        .withMessage('Expense type ID must be a string')
        .trim(),
    (0, express_validator_1.body)('expenseDate')
        .notEmpty()
        .withMessage('Expense date is required')
        .isISO8601()
        .withMessage('Invalid expense date format'),
    (0, express_validator_1.body)('amount')
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
    (0, express_validator_1.body)('note').optional().isString().trim(),
];
exports.validateUpdateExpense = [
    (0, express_validator_1.body)('expenseTypeId').optional().isString().trim(),
    (0, express_validator_1.body)('expenseDate').optional().isISO8601().withMessage('Invalid expense date format'),
    (0, express_validator_1.body)('amount')
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
    (0, express_validator_1.body)('note').optional().isString().trim(),
];
//# sourceMappingURL=expenses.validator.js.map