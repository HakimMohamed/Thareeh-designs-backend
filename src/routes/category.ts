import { Router } from 'express';
import { getCategories, getCategoryByName } from '../controllers/Categories.controller';

const router = Router();

router.get('/', getCategories);
router.get('/:category', getCategoryByName);

export default router;
