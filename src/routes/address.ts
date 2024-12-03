import { Router } from 'express';
import {
  createNewUserAddress,
  getCountries,
  getUserAddressById,
  getUserAddresses,
} from '../controllers/Address.controller';
import validateSchema from '../middlewares/validateSchema';
import { createNewUserAddressSchema, getUserAddressByIdSchema } from '../utils/validationSchemas';

const router = Router();

router.get('/', getCountries);
router.get('/user/', getUserAddresses);
router.get('/user/address', getUserAddressByIdSchema, validateSchema, getUserAddressById);
router.post('/', createNewUserAddressSchema, validateSchema, createNewUserAddress);

export default router;
