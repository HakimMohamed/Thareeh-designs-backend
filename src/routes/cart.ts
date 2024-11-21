import { Router } from 'express';
import validateSchemaMiddlware from '../middlewares/validateSchema';
import {
  createOrUpdateCartSchema,
  addItemToCartSchema,
  removeItemFromCartSchema,
} from '../utils/validationSchemas';
import {
  createOrUpdateCart,
  getUserCart,
  addItemToCart,
  removeItemFromCart,
} from '../controllers/Cart.controller';

const router = Router();

router.get('/', getUserCart);
router.post('/', createOrUpdateCartSchema, validateSchemaMiddlware, createOrUpdateCart);
router.post('/item', addItemToCartSchema, validateSchemaMiddlware, addItemToCart);
router.delete('/item', removeItemFromCartSchema, validateSchemaMiddlware, removeItemFromCart);

export default router;
