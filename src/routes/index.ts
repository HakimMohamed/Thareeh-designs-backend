import { Router } from 'express';
import authRoutes from './auth';
import itemsRoutes from './item';
import cartRoutes from './cart';
import addressRoutes from './address';
import ordersRoutes from './order';
import ticketRoutes from './ticket';

const router = Router();

router.use('/auth', authRoutes);
router.use('/items', itemsRoutes);
router.use('/cart', cartRoutes);
router.use('/addresses', addressRoutes);
router.use('/orders', ordersRoutes);
router.use('/tickets', ticketRoutes);

export default router;
