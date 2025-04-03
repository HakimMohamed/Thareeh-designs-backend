import { Router } from 'express';
import { getCategories } from '../controllers/Categories.controller';

const router = Router();

router.get('/', getCategories);

export default router;
