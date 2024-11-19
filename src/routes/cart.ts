import { Router } from 'express';
import validateSchemaMiddlware from '../middlewares/validateSchema';
import { createOrUpdateCartSchema, addItemToCartSchema } from '../utils/validationSchemas';
import { createOrUpdateCart, getUserCart, addItemToCart } from '../controllers/Cart.controller';

const router = Router();

router.get('/', getUserCart);
router.post('/', createOrUpdateCartSchema, validateSchemaMiddlware, createOrUpdateCart);
router.post('/item', addItemToCartSchema, validateSchemaMiddlware, addItemToCart);

export default router;
