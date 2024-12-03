import Order, { IOrder } from '../models/Order';
import { toObjectId } from '../utils/helpers';

class OrderService {
  async getUserOrders(userId: string): Promise<IOrder[] | null> {
    return Order.find({ _id: toObjectId(userId) }).lean<IOrder[] | null>();
  }
}

export default new OrderService();
