import { Router } from 'express';
import authRoutes from './auth';
import itemsRoutes from './item';
import cartRoutes from './cart';
import addressRoutes from './address';
import ordersRoutes from './order';

const router = Router();

router.use('/auth', authRoutes);
router.use('/items', itemsRoutes);
router.use('/cart', cartRoutes);
router.use('/address', addressRoutes);
router.use('/orders', ordersRoutes);

export default router;
