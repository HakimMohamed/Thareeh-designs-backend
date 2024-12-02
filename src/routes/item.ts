import { Router } from 'express';
import { getFeaturedItems, getItemById, getItems } from '../controllers/Item.controller';
import {
  getFeaturedItemsByIdSchema,
  getItemByIdSchema,
  getItemsSchema,
} from '../utils/validationSchemas';
import validateSchemaMiddlware from '../middlewares/validateSchema';

const router = Router();

router.get('/', getItemsSchema, validateSchemaMiddlware, getItems);
router.get('/featured', getFeaturedItemsByIdSchema, validateSchemaMiddlware, getFeaturedItems);
router.get('/:id', getItemByIdSchema, validateSchemaMiddlware, getItemById);

export default router;
