// src/validator/adminValidator.ts
import { body } from 'express-validator';

export const adminLoginValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .trim()
    .normalizeEmail(),
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
    .withMessage('Job role title must be between 2 and 100 characters')
    .trim()
    .custom((value) => {
      // Check if string contains only spaces or empty after trim
      if (!value || value.trim().length === 0) {
        throw new Error('Job role title cannot be empty or contain only spaces');
      }
      if (value.trim().length < 2) {
        throw new Error('Job role title must be at least 2 characters (excluding spaces)');
      }
      return true;
    })
    .escape(), // Sanitize to prevent XSS
  
  body('description')
    .optional()
    .trim()
    .custom((value) => {
      if (value && value.trim().length === 0) {
        throw new Error('Description cannot contain only spaces');
      }
      return true;
    })
    .escape(),
  
  body('requiredSkills')
    .isArray()
    .withMessage('Required skills must be an array')
    .notEmpty()
    .withMessage('At least one required skill is needed')
    .custom((skills: string[]) => {
      // Filter out empty strings and strings with only spaces
      const validSkills = skills.filter(skill => 
        skill && typeof skill === 'string' && skill.trim().length > 0
      );
      
      if (validSkills.length === 0) {
        throw new Error('At least one non-empty skill is required');
      }
      
      // Check for duplicate skills (case insensitive)
      const lowerCaseSkills = validSkills.map(s => s.toLowerCase().trim());
      const uniqueSkills = new Set(lowerCaseSkills);
      
      if (uniqueSkills.size !== validSkills.length) {
        throw new Error('Duplicate skills are not allowed');
      }
      
      return true;
    }),
  
  body('requiredSkills.*')
    .isString()
    .withMessage('Each skill must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Skill cannot be empty')
    .custom((value) => {
      if (value.trim().length === 0) {
        throw new Error('Skill cannot contain only spaces');
      }
      return true;
    })
    .escape(),
  
  body('category')
    .optional()
    .isString()
    .withMessage('Category must be a string')
    .trim()
    .custom((value) => {
      if (value && value.trim().length === 0) {
        throw new Error('Category cannot contain only spaces');
      }
      return true;
    })
    .escape(),
  
  body('experienceLevel')
    .optional()
    .isString()
    .withMessage('Experience level must be a string')
    .trim()
    .custom((value) => {
      if (value && value.trim().length === 0) {
        throw new Error('Experience level cannot contain only spaces');
      }
      return true;
    })
    .escape(),
  
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