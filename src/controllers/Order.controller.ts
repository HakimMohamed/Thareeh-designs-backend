import { NextFunction, Request, Response } from 'express';
import OrderService from '../services/Order.service';
import { GetUserOrderByIdResponse, GetUserOrdersResponse } from '../types/order';
import { CreateOrderDto, GetUserOrdersDto } from '../dtos/order.dto';
import CartService from '../services/Cart.service';
import ItemService from '../services/Item.service';
import { ICartItem } from '../models/Cart';
import AuthService from '../services/Auth.service';
import AddressService from '../services/Address.service';

export async function createOrder(
  req: Request<{}, {}, CreateOrderDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { address, paymentMethod, saveInfo } = req.body;

  const userId = req.user?.userId!;

  try {
    const cart = await CartService.getUserCart(userId);

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

    await Promise.all(promises);

    res.status(201).send({
      message: `Order created successfully.`,
      data: null,
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
