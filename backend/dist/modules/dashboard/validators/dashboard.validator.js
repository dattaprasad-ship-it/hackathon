"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBuzzPostsQuery = exports.validateEmployeesOnLeaveQuery = void 0;
const express_validator_1 = require("express-validator");
const business_exception_1 = require("../../../common/exceptions/business.exception");
exports.validateEmployeesOnLeaveQuery = [
    (0, express_validator_1.query)('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new business_exception_1.BusinessException(`Validation failed: ${errors.array().map((e) => e.msg).join(', ')}`, 400);
        }
        next();
    },
];
exports.validateBuzzPostsQuery = [
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage('Limit must be between 1 and 20'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new business_exception_1.BusinessException(`Validation failed: ${errors.array().map((e) => e.msg).join(', ')}`, 400);
        }
        next();
    },
];
//# sourceMappingURL=dashboard.validator.js.map