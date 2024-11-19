import { Router } from 'express';
import validateSchemaMiddlware from '../middlewares/validateSchema';
import { createOrUpdateCartSchema } from '../utils/validationSchemas';
import { createOrUpdateCart, getUserCart } from '../controllers/Cart.controller';

const router = Router();

router.get('/', getUserCart);
router.post('/', createOrUpdateCartSchema, validateSchemaMiddlware, createOrUpdateCart);

export default router;
