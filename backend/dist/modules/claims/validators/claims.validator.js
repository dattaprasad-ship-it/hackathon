"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRejectClaim = exports.validateClaimId = exports.validateClaimSearch = exports.validateUpdateClaim = exports.validateCreateClaim = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateClaim = [
    (0, express_validator_1.body)('employeeId')
        .notEmpty()
        .withMessage('Employee ID is required')
        .isString()
        .withMessage('Employee ID must be a string')
        .trim(),
    (0, express_validator_1.body)('eventTypeId')
        .notEmpty()
        .withMessage('Event type ID is required')
        .isString()
        .withMessage('Event type ID must be a string')
        .trim(),
    (0, express_validator_1.body)('currencyId')
        .notEmpty()
        .withMessage('Currency ID is required')
        .isString()
        .withMessage('Currency ID must be a string')
        .trim(),
    (0, express_validator_1.body)('remarks').optional().isString().trim(),
];
exports.validateUpdateClaim = [
    (0, express_validator_1.body)('eventTypeId').optional().isString().trim(),
    (0, express_validator_1.body)('currencyId').optional().isString().trim(),
    (0, express_validator_1.body)('remarks').optional().isString().trim(),
];
exports.validateClaimSearch = [
    (0, express_validator_1.query)('employeeName').optional().isString().trim(),
    (0, express_validator_1.query)('referenceId').optional().isString().trim(),
    (0, express_validator_1.query)('eventTypeId').optional().isString().trim(),
    (0, express_validator_1.query)('status').optional().isString().trim(),
    (0, express_validator_1.query)('fromDate').optional().isISO8601().withMessage('Invalid from date format'),
    (0, express_validator_1.query)('toDate').optional().isISO8601().withMessage('Invalid to date format'),
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('sortBy').optional().isString().trim(),
    (0, express_validator_1.query)('sortOrder').optional().isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC'),
];
exports.validateClaimId = [
    (0, express_validator_1.param)('id')
        .notEmpty()
        .withMessage('Claim ID is required')
        .isString()
        .withMessage('Claim ID must be a string')
        .trim(),
];
exports.validateRejectClaim = [
    (0, express_validator_1.body)('rejectionReason')
        .notEmpty()
        .withMessage('Rejection reason is required')
        .isString()
        .withMessage('Rejection reason must be a string')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Rejection reason must be between 1 and 1000 characters'),
];
//# sourceMappingURL=claims.validator.js.map