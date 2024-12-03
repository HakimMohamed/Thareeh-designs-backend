import Order, { IOrder } from '../models/Order';
import { toObjectId } from '../utils/helpers';

class OrderService {
  async getUserOrders(userId: string, page: number, pageSize: number): Promise<IOrder[] | null> {
    return Order.find({ _id: toObjectId(userId) })
      .skip(page * pageSize)
      .limit(pageSize)
      .lean<IOrder[] | null>();
  }
}

export default new OrderService();
