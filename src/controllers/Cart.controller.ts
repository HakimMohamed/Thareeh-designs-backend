import { NextFunction, Request, Response } from 'express';
import CartService from '../services/Cart.service';
import ItemService from '../services/Item.service';
import { AddItemToCartDto, CreateOrUpdateDto } from '../dtos/cart.dto';
import { AddItemToCartResponse, CreateOrUpdateCartResponse } from '../types/cart';
import { IItem } from '../models/Item';
import { ICartItem, IFormattedCart } from '../models/Cart';

export async function createOrUpdateCart(
  req: Request<{}, {}, CreateOrUpdateDto>,
  res: Response<CreateOrUpdateCartResponse>,
  next: NextFunction
): Promise<void> {
  const { items } = req.body;
  const userId = req.user?.userId!;

  try {
    const itemsIds = items.map((item: ICartItem) => item._id.toString());

    const fetchedItems: IItem[] | null = await ItemService.getItemsByIds(itemsIds);

    if (!fetchedItems || (fetchedItems && fetchedItems.length === 0)) {
      res.status(404).send({
        message: 'Something went wrong while adding item to cart.',
        data: null,
        success: false,
      });
      return;
    }

    await CartService.createOrUpdateCart(fetchedItems, userId);

    res.status(200).send({
      message: `Items fetched successfully.`,
      data: null,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function getUserCart(
  req: Request,
  res: Response<CreateOrUpdateCartResponse>,
  next: NextFunction
): Promise<void> {
  const userId = req.user?.userId!;

  try {
    const cart = await CartService.getUserCart(userId);

    if (!cart || cart.items.length === 0) {
      res.status(200).send({
        message: 'Cart is empty.',
        data: null,
        success: false,
      });
      return;
    }

    const discountItems = ItemService.applyDiscountToItems(cart.items as IItem[]);

    const formattedCart: IFormattedCart = await CartService.formatCart(cart, discountItems);

    res.status(200).send({
      message: `Cart fetched successfully.`,
      data: formattedCart,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function addItemToCart(
  req: Request<{}, {}, AddItemToCartDto>,
  res: Response<AddItemToCartResponse>,
  next: NextFunction
): Promise<void> {
  const { item } = req.body;
  const userId = req.user?.userId!;

  try {
    const [fetchedItem, cart] = await Promise.all([
      ItemService.getItemById(item),
      CartService.getUserCart(userId),
    ]);

    if (!fetchedItem) {
      res.status(404).send({
        message: 'Something went wrong while adding item to cart.',
        data: null,
        success: false,
      });
      return;
    }

    if (!cart) {
      await CartService.createOrUpdateCart([fetchedItem], userId);
      res.status(200).send({
        message: `Item added successfully.`,
        data: null,
        success: true,
      });
      return;
    }

    await CartService.addItemToCart(fetchedItem, cart._id);

    res.status(200).send({
      message: `Item added successfully.`,
      data: null,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}
