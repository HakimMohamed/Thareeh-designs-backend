import { Router } from 'express';
import authRoutes from './auth';
import itemsRoutes from './item';
import cartRoutes from './cart';
import addressRoutes from './address';
import ordersRoutes from './order';
import ticketRoutes from './ticket';
import bannerRoutes from './banner';
import categoryRoutes from './category';

const router = Router();

router.use('/auth', authRoutes);
router.use('/items', itemsRoutes);
router.use('/cart', cartRoutes);
router.use('/addresses', addressRoutes);
router.use('/orders', ordersRoutes);
router.use('/tickets', ticketRoutes);
router.use('/banner-settings', bannerRoutes);
router.use('/categories', categoryRoutes);

export default router;
