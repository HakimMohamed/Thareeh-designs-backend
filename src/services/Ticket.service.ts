import Order from '../models/Order';
import Ticket, { ITicket } from '../models/Ticket';
import { IUser } from '../models/User';
import { toObjectId } from '../utils/helpers';

class TicketService {
  async submitTicket(user: IUser, subject: string, description: string) {
    return Ticket.create({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      subject,
      description,
    });
  }

  async getUserTickets(userId: string): Promise<ITicket[]> {
    return Ticket.find({ 'user._id': toObjectId(userId) }).lean<ITicket[]>();
  }
}

export default new TicketService();
