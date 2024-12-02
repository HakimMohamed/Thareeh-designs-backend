import { Router } from 'express';
import { getCountries } from '../controllers/Address.controller';

const router = Router();

router.get('/', getCountries);

export default router;
