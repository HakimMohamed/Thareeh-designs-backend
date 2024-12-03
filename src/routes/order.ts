import { Router } from 'express';
import { getUserOrders, getUserOrderById } from '../controllers/Order.controller';
import validateSchema from '../middlewares/validateSchema';
import { getUserOrdersSchema, getUserOrderByIdSchema } from '../utils/validationSchemas';

const router = Router();

router.get('/', getUserOrdersSchema, validateSchema, getUserOrders);
router.get('/order', getUserOrderByIdSchema, validateSchema, getUserOrderById);

export default router;
