import { Router } from 'express';
import {
  createNewUserAddress,
  getCountries,
  getUserAddressById,
  getUserAddresses,
  removeUserAddress,
} from '../controllers/Address.controller';
import validateSchema from '../middlewares/validateSchema';
import {
  createNewUserAddressSchema,
  getUserAddressByIdSchema,
  removeUserAddressSchema,
} from '../utils/validationSchemas';

const router = Router();

router.get('/', getUserAddresses);
router.get('/countries', getCountries);
router.get('/user/address', getUserAddressByIdSchema, validateSchema, getUserAddressById);

router.delete('/user/address', removeUserAddressSchema, validateSchema, removeUserAddress);

router.post('/', createNewUserAddressSchema, validateSchema, createNewUserAddress);

export default router;
