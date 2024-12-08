import Order from '../models/Order';
import Ticket, { ITicket } from '../models/Ticket';
import { toObjectId } from '../utils/helpers';

class TicketService {
  async submitTicket(userId: string, subject: string, description: string) {
    return Ticket.create({ _user: toObjectId(userId), subject, description });
  }

  async getUserTickets(userId: string): Promise<ITicket[]> {
    return Ticket.find({ _user: toObjectId(userId) }).lean<ITicket[]>();
  }
}

export default new TicketService();
