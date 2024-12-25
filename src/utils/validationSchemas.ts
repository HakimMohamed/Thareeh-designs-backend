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

  body('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First name is required.')
    .isLength({ max: 256 })
    .withMessage('First name must be at most 256 characters long.'),

  body('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last name is required.')
    .isLength({ max: 256 })
    .withMessage('Last name must be at most 256 characters long.'),
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
export const verifyOtpSchema = [
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

  query('categories').optional(),
  query('sort').optional(),
];

export const getItemByIdSchema = [
  query('id')
    .isMongoId()
    .withMessage('Invalid item id.')
    .exists({ checkFalsy: true })
    .withMessage('Item id is required.'),
];

export const getFeaturedItemsByIdSchema = [
  query('excludeId').isMongoId().withMessage('Invalid item id.').optional(),

  query('pageSize')
    .exists({ checkFalsy: true })
    .withMessage('Page size is required.')
    .isLength({ min: 1, max: 100 })
    .withMessage('Page size must be exactly 4 characters long.'),
];

export const createOrUpdateCartSchema = [
  body('items')
    .exists({ checkFalsy: true })
    .withMessage('Items is required.')
    .isArray({ min: 1, max: 100 })
    .withMessage('Items must be an array of at least 1 item and at most 100 items.'),
];

export const addItemToCartSchema = [
  body('itemId')
    .exists({ checkFalsy: true })
    .withMessage('Item is required.')
    .isMongoId()
    .withMessage('Invalid item id.')
    .exists({ checkFalsy: true })
    .withMessage('Item id is required.'),
];

export const removeItemFromCartSchema = [
  body('itemId')
    .exists({ checkFalsy: true })
    .withMessage('Item is required.')
    .isMongoId()
    .withMessage('Invalid item id.')
    .exists({ checkFalsy: true })
    .withMessage('Item id is required.'),
];

export const updateItemQuantitySchema = [
  body('itemId')
    .exists({ checkFalsy: true })
    .withMessage('Item is required.')
    .isMongoId()
    .withMessage('Invalid item id.')
    .exists({ checkFalsy: true })
    .withMessage('Item id is required.'),

  body('quantity')
    .exists({ checkFalsy: true })
    .withMessage('Quantity is required.')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be an integer between 1 and 100.'),
];

export const createNewUserAddressSchema = [
  body('city').exists({ checkFalsy: true }).withMessage('City is required.'),
  body('country').exists({ checkFalsy: true }).withMessage('Country is required.'),
  body('name.first').exists({ checkFalsy: true }).withMessage('First name is required.'),
  body('name.last').exists({ checkFalsy: true }).withMessage('Last name is required.'),
  body('phone').exists({ checkFalsy: true }).withMessage('Phone is required.'),
  body('postalCode').optional(),
  body('region').exists({ checkFalsy: true }).withMessage('Region is required.'),
];

export const removeUserAddressSchema = [
  query('id')
    .isMongoId()
    .withMessage('Invalid address id.')
    .exists({ checkFalsy: true })
    .withMessage('Address id is required.'),
];

export const getUserAddressByIdSchema = [
  query('id')
    .isMongoId()
    .withMessage('Invalid address id.')
    .exists({ checkFalsy: true })
    .withMessage('Address id is required.'),
];

export const getUserOrdersSchema = [
  query('page').exists({ checkFalsy: true }).withMessage('page index is required.'),
  query('pageSize')
    .exists({ checkFalsy: true })
    .withMessage('page size is required.')
    .isLength({ min: 1, max: 100 })
    .withMessage('Otp must be exactly 4 characters long.'),
];

export const getUserOrderByIdSchema = [
  query('id')
    .isMongoId()
    .withMessage('Invalid order id.')
    .exists({ checkFalsy: true })
    .withMessage('Order id is required.'),
];

export const createOrderSchema = [
  body('paymentMethod').exists({ checkFalsy: true }).withMessage('Payment method is required.'),
  body('saveInfo').optional(),
  body('address').exists({ checkFalsy: true }).withMessage('Address is required.'),
  body('address.city').exists({ checkFalsy: true }).withMessage('City is required.'),
  body('address.country').exists({ checkFalsy: true }).withMessage('Country is required.'),
  body('address.name.first').exists({ checkFalsy: true }).withMessage('First name is required.'),
  body('address.name.last').exists({ checkFalsy: true }).withMessage('Last name is required.'),
  body('address.phone').exists({ checkFalsy: true }).withMessage('Phone is required.'),
  body('address.postalCode').optional(),
  body('address.region').exists({ checkFalsy: true }).withMessage('Region is required.'),
  body('address.type').exists({ checkFalsy: true }).withMessage('Type is required.'),
  body('address.details').exists({ checkFalsy: true }).withMessage('Details is required.'),
];

export const submitTicketSchema = [
  body('subject').exists({ checkFalsy: true }).withMessage('Title is required.'),
  body('description').exists({ checkFalsy: true }).withMessage('Description is required.'),
];

export const cancelOrderSchema = [
  body('orderId')
    .isMongoId()
    .withMessage('Invalid order id.')
    .exists({ checkFalsy: true })
    .withMessage('Order id is required.'),
];
