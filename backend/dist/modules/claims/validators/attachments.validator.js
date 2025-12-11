"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAttachmentId = exports.validateClaimId = void 0;
const express_validator_1 = require("express-validator");
exports.validateClaimId = [
    (0, express_validator_1.param)('id')
        .notEmpty()
        .withMessage('Claim ID is required')
        .isString()
        .withMessage('Claim ID must be a string')
        .trim(),
];
exports.validateAttachmentId = [
    (0, express_validator_1.param)('attachmentId')
        .notEmpty()
        .withMessage('Attachment ID is required')
        .isString()
        .withMessage('Attachment ID must be a string')
        .trim(),
];
//# sourceMappingURL=attachments.validator.js.map