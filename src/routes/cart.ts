import { Router } from 'express';
import validateSchemaMiddlware from '../middlewares/validateSchema';
import { createOrUpdateCartSchema } from '../utils/validationSchemas';
import { createOrUpdateCart } from '../controllers/cart';

const router = Router();

router.post('/', createOrUpdateCartSchema, validateSchemaMiddlware, createOrUpdateCart);

export default router;
