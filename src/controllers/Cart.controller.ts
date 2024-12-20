import { NextFunction, Request, Response } from 'express';
import CartService from '../services/Cart.service';
import ItemService from '../services/Item.service';
import {
  AddItemToCartDto,
  CreateOrUpdateDto,
  RemoveItemFromCartDto,
  UpdateItemQuantityDto,
} from '../dtos/cart.dto';
import { CreateOrUpdateCartResponse } from '../types/cart';
import { ICartItem } from '../models/Cart';

export async function createOrUpdateCart(
  req: Request<{}, {}, CreateOrUpdateDto>,
  res: Response<CreateOrUpdateCartResponse>,
  next: NextFunction
): Promise<void> {
  const { items } = req.body;
  const userId = req.user?.userId!;

  try {
    const itemsIds = items.map((item: ICartItem) => item._id.toString());

    const fetchedItems = await ItemService.getItemsByIds(itemsIds);

    if (!fetchedItems || (fetchedItems && fetchedItems.length === 0)) {
      res.status(404).send({
        message: 'Something went wrong while adding item to cart.',
        data: null,
        success: false,
      });
      return;
    }

    await CartService.createOrUpdateCart(fetchedItems, userId, items);

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

    if (!cart || cart?.items?.length === 0) {
      res.status(404).send({
        message: 'Cart is empty.',
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
        message: 'Items not found.',
        data: null,
        success: false,
      });
      return;
    }

    const formattedCart = CartService.formatCart(cart, fetchedItems);

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
  res: Response,
  next: NextFunction
): Promise<void> {
  const { itemId } = req.body;
  const userId = req.user?.userId!;

  try {
    const [item, cart] = await Promise.all([
      ItemService.getItemById(itemId),
      CartService.getUserCart(userId),
    ]);

    if (!item) {
      res.status(404).send({
        message: 'Something went wrong while adding item to cart.',
        data: null,
        success: false,
      });
      return;
    }

    if (!cart || cart?.items?.length === 0) {
      await CartService.createOrUpdateCart([item], userId, [
        { _id: item._id, name: item.name, quantity: 1 },
      ]);
    } else {
      await CartService.addItemToCart(item, userId, cart.items);
    }

    res.status(200).send({
      message: `Item added successfully.`,
      data: null,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function removeItemFromCart(
  req: Request<{}, {}, RemoveItemFromCartDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { itemId } = req.body;
  const userId = req.user?.userId!;

  try {
    await CartService.removeItemFromCart(itemId, userId);

    res.status(200).send({
      message: `Item removed successfully.`,
      data: null,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function clearUserCart(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.user?.userId!;

  try {
    await CartService.clearUserCart(userId);

    res.status(200).send({
      message: `Cart cleared successfully.`,
      data: null,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function updateItemQuantity(
  req: Request<{}, {}, UpdateItemQuantityDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { itemId, quantity } = req.body;
  const userId = req.user?.userId!;

  try {
    await CartService.updateCartItemQuantity(itemId, quantity, userId);

    res.status(200).send({
      message: `Cart cleared successfully.`,
      data: null,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}
