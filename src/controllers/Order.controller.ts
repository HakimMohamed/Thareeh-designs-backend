import { NextFunction, Request, Response } from 'express';
import OrderService from '../services/Order.service';
import { GetUserOrdersResponse } from '../types/order';
import { GetUserOrdersDto } from '../dtos/order.dto';

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
