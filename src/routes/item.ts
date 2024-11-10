import { Router } from 'express';
import { getItems } from '../controllers/item';
import { getItemsSchema } from '../utils/validationSchemas';
import validateSchemaMiddlware from '../middlewares/validateSchema';

const router = Router();

router.get('/', getItemsSchema, validateSchemaMiddlware, getItems);

export default router;
