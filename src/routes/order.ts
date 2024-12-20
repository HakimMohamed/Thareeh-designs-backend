import { Router } from 'express';
import { getUserOrders, getUserOrderById, createOrder } from '../controllers/Order.controller';
import validateSchema from '../middlewares/validateSchema';
import {
  getUserOrdersSchema,
  getUserOrderByIdSchema,
  createOrderSchema,
} from '../utils/validationSchemas';

const router = Router();

router.get('/', getUserOrdersSchema, validateSchema, getUserOrders);
router.get('/order', getUserOrderByIdSchema, validateSchema, getUserOrderById);
router.post('/order', createOrderSchema, validateSchema, createOrder);

export default router;
