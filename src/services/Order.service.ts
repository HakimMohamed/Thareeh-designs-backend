import { ObjectId } from 'mongoose';
import { ICart, IFormattedCart } from '../models/Cart';
import Order, { IOrder } from '../models/Order';
import { IUser } from '../models/User';
import { toObjectId } from '../utils/helpers';

class OrderService {
  async getUserOrders(userId: string, page: number, pageSize: number): Promise<IOrder[] | null> {
    return Order.find({ _id: toObjectId(userId) })
      .skip(page * pageSize)
      .limit(pageSize)
      .lean<IOrder[] | null>();
  }

  async getUserOrderById(orderId: string, userId: string): Promise<IOrder | null> {
    return Order.findOne({
      _id: toObjectId(orderId),
      _user: toObjectId(userId),
    }).lean<IOrder | null>();
  }

  async createOrder(
    userId: string,
    address: IOrder['shippingAddress'],
    paymentMethod: 'online' | 'cod',
    cart: IFormattedCart
  ): Promise<IOrder> {
    const formattedOrder: Omit<IOrder, '_id'> = {
      _user: toObjectId(userId),
      items: cart.items,
      status: 'pending',
      shippingAddress: address,
      payment: {
        method: paymentMethod,
        status: 'pending',
      },
      price: {
        total: cart.price,
        shipping: 20, // temp value
        discount: cart.originalPrice - cart.price,
        tax: 0,
      },
    };

    const newOrder = new Order(formattedOrder);

    return newOrder.save();
  }

  async cancelOrder(orderId: string, userId: string) {
    return Order.updateOne(
      { _id: toObjectId(orderId), _user: toObjectId(userId) },
      { status: 'cancelled' }
    );
  }
}

export default new OrderService();
