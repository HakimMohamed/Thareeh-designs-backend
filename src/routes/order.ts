import { Router } from 'express';
import { getUserOrders } from '../controllers/Order.controller';

const router = Router();

router.get('/', getUserOrders);

export default router;
