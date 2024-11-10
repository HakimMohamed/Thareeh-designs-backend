import { NextFunction, Request, Response } from 'express';
import { GetItemsQueryParams } from '../types/query-parameters';
import { GetItemsResponse } from '../types/items';
import ItemService from '../services/item';

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
