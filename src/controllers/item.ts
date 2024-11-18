import { NextFunction, Request, Response } from 'express';
import { GetItemByIdQueryParams, GetItemsQueryParams } from '../types/query-parameters';
import { GetFeaturedItemsResponse, GetItemByIdResponse, GetItemsResponse } from '../types/items';
import ItemService from '../services/item';
import { FeaturedItemsDto } from '../dtos/items.dto';

export async function getItems(
  req: Request<{}, {}, {}, GetItemsQueryParams>,
  res: Response<GetItemsResponse>,
  next: NextFunction
): Promise<void> {
  const { page, pageSize } = req.query;

  try {
    const items = await ItemService.getItems(Number(page), Number(pageSize));

    res.status(200).send({
      message: `Items fetched successfully.`,
      data: items,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function getItemById(
  req: Request<GetItemByIdQueryParams>,
  res: Response<GetItemByIdResponse>,
  next: NextFunction
): Promise<void> {
  const { id } = req.params;

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
  req: Request<FeaturedItemsDto>,
  res: Response<GetFeaturedItemsResponse>,
  next: NextFunction
): Promise<void> {
  const { pageSize, excludeId } = req.query;

  try {
    const item = await ItemService.getFeaturedItems(excludeId as string, Number(pageSize));

    res.status(200).send({
      message: `Items fetched successfully.`,
      data: item,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}
