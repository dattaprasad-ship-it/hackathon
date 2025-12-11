"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.validateEmployeeListQuery = exports.validateUpdateEmployee = exports.validateCreateEmployee = void 0;
const express_validator_1 = require("express-validator");
const business_exception_1 = require("../../../common/exceptions/business.exception");
exports.validateCreateEmployee = [
    (0, express_validator_1.body)('employeeId')
        .notEmpty()
        .withMessage('Employee ID is required')
        .isString()
        .withMessage('Employee ID must be a string')
        .trim(),
    (0, express_validator_1.body)('firstName')
        .notEmpty()
        .withMessage('First name is required')
        .isString()
        .withMessage('First name must be a string')
        .trim(),
    (0, express_validator_1.body)('lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .isString()
        .withMessage('Last name must be a string')
        .trim(),
    (0, express_validator_1.body)('middleName').optional().isString().trim(),
    (0, express_validator_1.body)('jobTitleId').optional().isUUID().withMessage('Invalid job title ID'),
    (0, express_validator_1.body)('employmentStatusId').optional().isUUID().withMessage('Invalid employment status ID'),
    (0, express_validator_1.body)('subUnitId').optional().isUUID().withMessage('Invalid sub-unit ID'),
    (0, express_validator_1.body)('supervisorId').optional().isUUID().withMessage('Invalid supervisor ID'),
    (0, express_validator_1.body)('reportingMethodId').optional().isUUID().withMessage('Invalid reporting method ID'),
    (0, express_validator_1.body)('profilePhotoPath').optional().isString(),
    (0, express_validator_1.body)('createLoginDetails').optional().isBoolean(),
    (0, express_validator_1.body)('username')
        .optional()
        .isString()
        .withMessage('Username must be a string')
        .trim()
        .custom((value, { req }) => {
        if (req.body.createLoginDetails && !value) {
            throw new business_exception_1.BusinessException('Username is required when creating login details', 400, 'VALIDATION_ERROR');
        }
        return true;
    }),
    (0, express_validator_1.body)('password')
        .optional()
        .isString()
        .withMessage('Password must be a string')
        .custom((value, { req }) => {
        if (req.body.createLoginDetails && !value) {
            throw new business_exception_1.BusinessException('Password is required when creating login details', 400, 'VALIDATION_ERROR');
        }
        return true;
    }),
    (0, express_validator_1.body)('confirmPassword')
        .optional()
        .isString()
        .withMessage('Confirm password must be a string')
        .custom((value, { req }) => {
        if (req.body.createLoginDetails && !value) {
            throw new business_exception_1.BusinessException('Confirm password is required when creating login details', 400, 'VALIDATION_ERROR');
        }
        if (req.body.password && value !== req.body.password) {
            throw new business_exception_1.BusinessException('Password and confirm password do not match', 400, 'VALIDATION_ERROR');
        }
        return true;
    }),
    (0, express_validator_1.body)('loginStatus')
        .optional()
        .isIn(['Enabled', 'Disabled'])
        .withMessage('Login status must be either Enabled or Disabled'),
];
exports.validateUpdateEmployee = [
    (0, express_validator_1.body)('employeeId').optional().isString().trim(),
    (0, express_validator_1.body)('firstName').optional().isString().trim(),
    (0, express_validator_1.body)('lastName').optional().isString().trim(),
    (0, express_validator_1.body)('middleName').optional().isString().trim(),
    (0, express_validator_1.body)('jobTitleId').optional().isUUID().withMessage('Invalid job title ID'),
    (0, express_validator_1.body)('employmentStatusId').optional().isUUID().withMessage('Invalid employment status ID'),
    (0, express_validator_1.body)('subUnitId').optional().isUUID().withMessage('Invalid sub-unit ID'),
    (0, express_validator_1.body)('supervisorId').optional().isUUID().withMessage('Invalid supervisor ID'),
    (0, express_validator_1.body)('reportingMethodId').optional().isUUID().withMessage('Invalid reporting method ID'),
    (0, express_validator_1.body)('profilePhotoPath').optional().isString(),
    (0, express_validator_1.body)('username').optional().isString().trim(),
    (0, express_validator_1.body)('password').optional().isString(),
    (0, express_validator_1.body)('loginStatus')
        .optional()
        .isIn(['Enabled', 'Disabled'])
        .withMessage('Login status must be either Enabled or Disabled'),
];
exports.validateEmployeeListQuery = [
    (0, express_validator_1.query)('employeeName').optional().isString().trim(),
    (0, express_validator_1.query)('employeeId').optional().isString().trim(),
    (0, express_validator_1.query)('employmentStatusId').optional().isUUID().withMessage('Invalid employment status ID'),
    (0, express_validator_1.query)('jobTitleId').optional().isUUID().withMessage('Invalid job title ID'),
    (0, express_validator_1.query)('subUnitId').optional().isUUID().withMessage('Invalid sub-unit ID'),
    (0, express_validator_1.query)('supervisorId').optional().isUUID().withMessage('Invalid supervisor ID'),
    (0, express_validator_1.query)('include')
        .optional()
        .isIn(['current', 'all'])
        .withMessage('Include must be either "current" or "all"'),
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 500 }).withMessage('Limit must be between 1 and 500'),
    (0, express_validator_1.query)('sortBy').optional().isString().trim(),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['ASC', 'DESC'])
        .withMessage('Sort order must be either ASC or DESC'),
];
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: errors.mapped(),
            },
        });
        return;
    }
    next();
};
exports.validate = validate;
//# sourceMappingURL=employees.validator.js.map