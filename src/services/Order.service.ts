import { ObjectId, UpdateResult } from 'mongoose';
import { ICart, IFormattedCart } from '../models/Cart';
import Order, { IOrder } from '../models/Order';
import { IUser } from '../models/User';
import { toObjectId } from '../utils/helpers';
import EmailService from './Email.service';
import { SendMailOptions } from 'nodemailer';

class OrderService {
  async getUserOrders(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<[IOrder[] | null, number]> {
    return Promise.all([
      Order.find({ _user: toObjectId(userId) })
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean<IOrder[] | null>(),
      Order.countDocuments({ _user: toObjectId(userId) }),
    ]);
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
  ): Promise<IOrder | UpdateResult> {
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

    return Order.create(formattedOrder);
  }

  async cancelOrder(orderId: string, userId: string) {
    return Order.updateOne(
      { _id: toObjectId(orderId), _user: toObjectId(userId) },
      { status: 'cancelled' }
    );
  }

  async sendOrderConfirmation(email: string): Promise<void> {
    const emailService = await EmailService.getInstance();

    const message = 'Your order has been confirmed.';
    const mailOptions: SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Order Confirmation',
      text: message,
      html: `<p>Your order has been confirmed. Thank you for shopping with us.</p>`,
    };
    await emailService.sendEmail(mailOptions);
  }
}

export default new OrderService();
