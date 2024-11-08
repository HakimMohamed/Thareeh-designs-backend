import { Router } from 'express';
import {
  register,
  login,
  refreshAccessToken,
  completeRegsitration,
  logout,
  verifyEmail,
} from '../controllers/auth';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  completeRegisterationSchema,
  verifyEmailSchema,
} from '../utils/validationSchemas';
import validateSchemaMiddlware from '../middlewares/validateSchema';

const router = Router();

// /api/auth

router.post('/register', registerSchema, validateSchemaMiddlware, register);
router.post(
  '/complete-registeration',
  completeRegisterationSchema,
  validateSchemaMiddlware,
  completeRegsitration
);
router.post('/login', loginSchema, validateSchemaMiddlware, login);
router.post('/email/verify', verifyEmailSchema, validateSchemaMiddlware, verifyEmail);
router.post('/refresh-token', refreshTokenSchema, validateSchemaMiddlware, refreshAccessToken);
router.delete('/logout', refreshTokenSchema, validateSchemaMiddlware, logout);

//

// router.get('/forgot-password', authenticateToken, login);
// router.get('/reset-password', login);

export default router;
