"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.loginValidation = void 0;
const express_validator_1 = require("express-validator");
exports.loginValidation = [
    (0, express_validator_1.body)('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 1, max: 255 })
        .withMessage('Username must be between 1 and 255 characters'),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 1, max: 255 })
        .withMessage('Password must be between 1 and 255 characters'),
];
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorResponse = {
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: errors.mapped(),
            },
        };
        res.status(400).json(errorResponse);
        return;
    }
    next();
};
exports.validate = validate;
//# sourceMappingURL=authentication.validator.js.map