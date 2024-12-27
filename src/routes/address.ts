import { Router } from 'express';
import {
  createNewUserAddress,
  getCountries,
  getUserAddressById,
  getUserAddresses,
  removeUserAddress,
  updateUserAddress,
} from '../controllers/Address.controller';
import validateSchema from '../middlewares/validateSchema';
import {
  createNewUserAddressSchema,
  getUserAddressByIdSchema,
  removeUserAddressSchema,
  updateUserAddressSchema,
} from '../utils/validationSchemas';

const router = Router();

router.get('/', getUserAddresses);
router.get('/countries', getCountries);
router.get('/address', getUserAddressByIdSchema, validateSchema, getUserAddressById);

router.delete('/address', removeUserAddressSchema, validateSchema, removeUserAddress);
router.patch('/address', updateUserAddressSchema, validateSchema, updateUserAddress);

router.post('/', createNewUserAddressSchema, validateSchema, createNewUserAddress);

export default router;
