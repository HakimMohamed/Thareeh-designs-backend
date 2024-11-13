import { Router } from 'express';
import { getItemById, getItems } from '../controllers/item';
import { getItemsSchema } from '../utils/validationSchemas';
import validateSchemaMiddlware from '../middlewares/validateSchema';

const router = Router();

router.get('/', getItemsSchema, validateSchemaMiddlware, getItems);
router.get('/:id', getItemsSchema, validateSchemaMiddlware, getItemById);

export default router;
