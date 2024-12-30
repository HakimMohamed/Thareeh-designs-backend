import { Router } from 'express';
import {
  getFeaturedItems,
  getItemById,
  getItems,
  getItemsSearchResults,
} from '../controllers/Item.controller';
import {
  getFeaturedItemsByIdSchema,
  getItemByIdSchema,
  getItemsSchema,
  getItemsSearchResultsSchema,
} from '../utils/validationSchemas';
import validateSchemaMiddlware from '../middlewares/validateSchema';

const router = Router();

router.get('/', getItemsSchema, validateSchemaMiddlware, getItems);
router.get('/featured', getFeaturedItemsByIdSchema, validateSchemaMiddlware, getFeaturedItems);
router.get('/item', getItemByIdSchema, validateSchemaMiddlware, getItemById);
router.get('/search', getItemsSearchResultsSchema, validateSchemaMiddlware, getItemsSearchResults);

export default router;
