import { Router } from 'express';
import {
  createNewUserAddress,
  getCountries,
  getUserAddresses,
} from '../controllers/Address.controller';
import validateSchema from '../middlewares/validateSchema';
import { createNewUserAddressSchema } from '../utils/validationSchemas';

const router = Router();

router.get('/', getCountries);
router.get('/user', getUserAddresses);
router.post('/', createNewUserAddressSchema, validateSchema, createNewUserAddress);

export default router;
