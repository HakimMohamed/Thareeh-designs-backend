import { Router } from 'express';
import validateSchemaMiddlware from '../middlewares/validateSchema';
import {
  createOrUpdateCartSchema,
  addItemToCartSchema,
  removeItemFromCartSchema,
  updateItemQuantitySchema,
} from '../utils/validationSchemas';
import {
  createOrUpdateCart,
  getUserCart,
  addItemToCart,
  removeItemFromCart,
  clearUserCart,
  updateItemQuantity,
} from '../controllers/Cart.controller';

const router = Router();

router.get('/', getUserCart);
router.post('/', createOrUpdateCartSchema, validateSchemaMiddlware, createOrUpdateCart);
router.delete('/', clearUserCart);
router.post('/item', addItemToCartSchema, validateSchemaMiddlware, addItemToCart);
router.delete('/item', removeItemFromCartSchema, validateSchemaMiddlware, removeItemFromCart);
router.patch('/item', updateItemQuantitySchema, validateSchemaMiddlware, updateItemQuantity);
// update item quantity

export default router;
