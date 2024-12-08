import { Router } from 'express';
import validateSchema from '../middlewares/validateSchema';
import { submitTicketSchema } from '../utils/validationSchemas';
import { getUserTickets, submitTicket } from '../controllers/Ticket.controller';

const router = Router();

router.get('/', getUserTickets);
router.post('/', submitTicketSchema, validateSchema, submitTicket);

export default router;
