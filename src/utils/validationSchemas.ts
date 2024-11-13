// src/utils/validationSchemas.ts

import { body, param, query } from 'express-validator';

export const registerSchema = [
  body('email')
    .exists({ checkFalsy: true })
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Email must be a valid email address.')
    .isLength({ max: 256 })
    .withMessage('Email must be at most 256 characters long.'),
];

export const completeRegisterationSchema = [
  body('email')
    .exists({ checkFalsy: true })
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Email must be a valid email address.')
    .isLength({ max: 256 })
    .withMessage('Email must be at most 256 characters long.'),

  body('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required.')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    ),

  body('otp')
    .exists({ checkFalsy: true })
    .withMessage('Otp is required.')
    .isLength({ min: 4, max: 4 })
    .withMessage('Otp must be exactly 4 characters long.'),
];
export const loginSchema = [
  body('email')
    .exists({ checkFalsy: true })
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Email must be a valid email address.')
    .isLength({ max: 256 })
    .withMessage('Email must be at most 256 characters long.'),

  body('password').exists({ checkFalsy: true }).withMessage('Password is required.'),
];
export const requestEmailOTPSchema = [
  body('email')
    .exists({ checkFalsy: true })
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Email must be a valid email address.')
    .isLength({ max: 256 })
    .withMessage('Email must be at most 256 characters long.'),
];
export const verifyEmailSchema = [
  body('email')
    .exists({ checkFalsy: true })
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Email must be a valid email address.')
    .isLength({ max: 256 })
    .withMessage('Email must be at most 256 characters long.'),

  body('otp')
    .exists({ checkFalsy: true })
    .withMessage('Otp is required.')
    .isLength({ min: 4, max: 4 })
    .withMessage('Otp must be exactly 4 characters long.'),
];

export const refreshTokenSchema = [
  body('refreshToken').exists({ checkFalsy: true }).withMessage('Refresh token is required.'),
];

export const getItemsSchema = [
  query('page').exists({ checkFalsy: true }).withMessage('page index is required.'),
  query('pageSize')
    .exists({ checkFalsy: true })
    .withMessage('page size is required.')
    .isLength({ min: 1, max: 100 })
    .withMessage('Otp must be exactly 4 characters long.'),
];

export const getItemByIdSchema = [
  param('id')
    .isMongoId()
    .withMessage('Invalid item id.')
    .exists({ checkFalsy: true })
    .withMessage('Item id is required.'),
];
