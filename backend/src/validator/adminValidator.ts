// src/validator/adminValidator.ts
import { body } from 'express-validator';

export const adminLoginValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const jobRoleValidator = [
  body('title')
    .notEmpty()
    .withMessage('Job role title is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Job role title must be between 2 and 100 characters'),
  body('requiredSkills')
    .isArray()
    .withMessage('Required skills must be an array')
    .notEmpty()
    .withMessage('At least one required skill is needed'),
  body('requiredSkills.*')
    .isString()
    .withMessage('Each skill must be a string'),
  body('category')
    .optional()
    .isString()
    .withMessage('Category must be a string'),
  body('experienceLevel')
    .optional()
    .isString()
    .withMessage('Experience level must be a string'),
  body('minExperience')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum experience must be a positive number'),
  body('maxExperience')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Maximum experience must be a positive number')
    .custom((value, { req }) => {
      if (req.body.minExperience && value < req.body.minExperience) {
        throw new Error('Maximum experience must be greater than minimum experience');
      }
      return true;
    }),
];