import { NextFunction, Request, Response } from 'express';
import CartService from '../services/Cart.service';
import ItemService from '../services/Item.service';
import { CreateOrUpdateDto } from '../dtos/cart.dto';
import { CreateOrUpdateCartResponse } from '../types/cart';
import { IItem } from '../models/Item';

export async function createOrUpdateCart(
  req: Request<{}, {}, CreateOrUpdateDto>,
  res: Response<CreateOrUpdateCartResponse>,
  next: NextFunction
): Promise<void> {
  const { item } = req.body;

  try {
    const fetchedItem: IItem | null = await ItemService.getItemById(item);

    if (!fetchedItem) {
      res.status(404).send({
        message: 'Something went wrong while adding item to cart.',
        data: null,
        success: false,
      });
      return;
    }

    await CartService.createOrUpdateCart(fetchedItem, req.user?.userId!);

    res.status(200).send({
      message: `Items fetched successfully.`,
      data: null,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}
