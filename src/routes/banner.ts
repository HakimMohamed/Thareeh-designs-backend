import { Router } from 'express';
import { getBannerSettings } from '../controllers/Banner.controller';

const router = Router();

router.get('/', getBannerSettings);

export default router;
