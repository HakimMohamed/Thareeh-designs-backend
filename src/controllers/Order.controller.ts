import { NextFunction, Request, Response } from 'express';
import OrderService from '../services/Order.service';
import {
  CreateOrderResponse,
  GetUserOrderByIdResponse,
  GetUserOrdersResponse,
} from '../types/order';
import { CancelOrderDto, CreateOrderDto, GetUserOrdersDto } from '../dtos/order.dto';
import CartService from '../services/Cart.service';
import ItemService from '../services/Item.service';
import { ICartItem } from '../models/Cart';
import AuthService from '../services/Auth.service';
import AddressService from '../services/Address.service';
import EmailService from '../services/Email.service';
import { IOrder } from '../models/Order';

export async function cancelOrder(
  req: Request<{}, {}, CancelOrderDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { orderId } = req.body;

  const userId = req.user?.userId!;

  try {
    const order = await OrderService.getUserOrderById(orderId, userId);

    if (!order) {
      res.status(404).send({
        message: 'Order not found.',
        data: null,
        success: false,
      });
      return;
    }

    if (order.status === 'cancelled') {
      res.status(400).send({
        message: 'Order already cancelled.',
        data: null,
        success: false,
      });
      return;
    }

    if (order.status === 'delivered') {
      res.status(400).send({
        message: 'Order already delivered request refund.',
        data: null,
        success: false,
      });
      return;
    }

    await OrderService.cancelOrder(orderId, userId);

    res.status(201).send({
      message: `Order cancelled successfully.`,
      data: null,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function createOrder(
  req: Request<{}, {}, CreateOrderDto>,
  res: Response<CreateOrderResponse>,
  next: NextFunction
): Promise<void> {
  const { address, paymentMethod, saveInfo } = req.body;

  const userId = req.user?.userId!;

  try {
    const [cart, user] = await Promise.all([
      CartService.getUserCart(userId),
      AuthService.getUserById(userId),
    ]);

    if (!cart || cart?.items?.length === 0) {
      res.status(404).send({
        message: 'Please create a cart first start by adding one item.',
        data: null,
        success: false,
      });
      return;
    }

    const fetchedItems = await ItemService.getItemsByIds(
      cart.items.map((item: ICartItem) => item._id.toString())
    );

    if (!fetchedItems || (fetchedItems && fetchedItems.length === 0)) {
      res.status(404).send({
        message: 'Cart is empty.',
        data: null,
        success: false,
      });
      return;
    }

    const formattedCart = CartService.formatCart(cart, fetchedItems);

    const promises = [
      OrderService.createOrder(userId, address, paymentMethod, formattedCart),
      CartService.completeCart(userId),
    ];

    if (saveInfo) {
      promises.push(AddressService.createNewUserAddress(userId, address));
    }

    const result = await Promise.all(promises);

    OrderService.sendOrderConfirmation(user?.email!);

    res.status(201).send({
      message: `Order created successfully.`,
      data: result[0] as IOrder,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function getUserOrders(
  req: Request<{}, {}, {}, GetUserOrdersDto>,
  res: Response<GetUserOrdersResponse>,
  next: NextFunction
): Promise<void> {
  const { page = 0, pageSize = 10 } = req.query;

  const userId = req.user?.userId!;

  try {
    const orders = await OrderService.getUserOrders(userId, Number(page), Number(pageSize));

    res.status(200).send({
      message: `Orders fetched successfully.`,
      data: orders,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function getUserOrderById(
  req: Request<{}, {}, {}, GetUserOrdersDto>,
  res: Response<GetUserOrderByIdResponse>,
  next: NextFunction
): Promise<void> {
  const { id } = req.query;

  const userId = req.user?.userId!;

  try {
    const order = await OrderService.getUserOrderById(id as string, userId);

    res.status(200).send({
      message: `Orders fetched successfully.`,
      data: order,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}
