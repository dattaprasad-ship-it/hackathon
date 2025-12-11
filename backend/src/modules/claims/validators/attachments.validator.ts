import { param, ValidationChain } from 'express-validator';

export const validateClaimId: ValidationChain[] = [
  param('id')
    .notEmpty()
    .withMessage('Claim ID is required')
    .isString()
    .withMessage('Claim ID must be a string')
    .trim(),
];

export const validateAttachmentId: ValidationChain[] = [
  param('attachmentId')
    .notEmpty()
    .withMessage('Attachment ID is required')
    .isString()
    .withMessage('Attachment ID must be a string')
    .trim(),
];

