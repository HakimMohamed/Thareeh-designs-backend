import { NextFunction, Request, Response } from 'express';
import OrderService from '../services/Order.service';
import { GetUserOrdersResponse } from '../types/order';

export async function getUserOrders(
  req: Request,
  res: Response<GetUserOrdersResponse>,
  next: NextFunction
): Promise<void> {
  const userId = req.user?.userId!;

  try {
    const orders = await OrderService.getUserOrders(userId);

    res.status(200).send({
      message: `Orders fetched successfully.`,
      data: orders,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}
