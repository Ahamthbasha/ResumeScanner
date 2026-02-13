import { body } from 'express-validator';

export const compareValidation = [
  body('resumeId')
    .notEmpty()
    .withMessage('Resume ID is required')
    .isUUID()
    .withMessage('Invalid Resume ID format'),
  body('jobRoleId')
    .notEmpty()
    .withMessage('Job Role ID is required')
    .isUUID()
    .withMessage('Invalid Job Role ID format'),
];