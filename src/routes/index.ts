import { Router } from 'express';
import authRoutes from './auth';
import itemsRoutes from './item';

const router = Router();

router.use('/auth', authRoutes);
router.use('/items', itemsRoutes);

export default router;
