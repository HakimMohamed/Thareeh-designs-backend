import { NextFunction, Request, Response } from 'express';
import {
  FeaturedItemsDto,
  GetItemByIdQueryParams,
  GetItemsQueryParams,
} from '../types/query-parameters';
import { GetFeaturedItemsResponse, GetItemByIdResponse, GetItemsResponse } from '../types/items';
import ItemService from '../services/Item.service';

export async function getItems(
  req: Request<{}, {}, {}, GetItemsQueryParams>,
  res: Response<GetItemsResponse>,
  next: NextFunction
): Promise<void> {
  const { page, pageSize, categories, sort } = req.query;

  const categoriesArray = (categories && categories.split(',')) || [];

  try {
    const { items, count, filters } = await ItemService.getItems(
      Number(page),
      Number(pageSize),
      categoriesArray,
      sort as string
    );

    res.status(200).send({
      message: `Items fetched successfully.`,
      data: {
        items,
        count,
        filters,
      },
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function getItemById(
  req: Request<{}, {}, {}, GetItemByIdQueryParams>,
  res: Response<GetItemByIdResponse>,
  next: NextFunction
): Promise<void> {
  const { id } = req.query;

  try {
    const item = await ItemService.getItemById(id as string);

    res.status(200).send({
      message: `Items fetched successfully.`,
      data: item,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function getFeaturedItems(
  req: Request<{}, {}, {}, FeaturedItemsDto>,
  res: Response<GetFeaturedItemsResponse>,
  next: NextFunction
): Promise<void> {
  const { pageSize, excludeId, cartItems } = req.query;
  const parsedCartItems = cartItems && cartItems.length > 0 ? JSON.parse(cartItems as string) : [];
  try {
    const items = await ItemService.getFeaturedItems(
      Number(pageSize),
      excludeId as string,
      parsedCartItems
    );
    res.status(200).send({
      message: `Items fetched successfully.`,
      data: items,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}
