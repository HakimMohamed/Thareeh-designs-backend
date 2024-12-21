import { Router } from 'express';
import {
  getUserOrders,
  getUserOrderById,
  createOrder,
  cancelOrder,
} from '../controllers/Order.controller';
import validateSchema from '../middlewares/validateSchema';
import {
  getUserOrdersSchema,
  getUserOrderByIdSchema,
  createOrderSchema,
  cancelOrderSchema,
} from '../utils/validationSchemas';

const router = Router();

router.get('/', getUserOrdersSchema, validateSchema, getUserOrders);
router.get('/order', getUserOrderByIdSchema, validateSchema, getUserOrderById);
router.post('/order', createOrderSchema, validateSchema, createOrder);
router.delete('/order', cancelOrderSchema, validateSchema, cancelOrder);

export default router;
