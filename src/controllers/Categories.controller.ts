import { NextFunction, Request, Response } from 'express';
import CategoriesService from '../services/categories.service';

export async function getCategories(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const categories = await CategoriesService.getCategories();

    res.status(200).send({
      message: `Categories fetched successfully.`,
      data: categories,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function getCategoryByName(
  req: Request<{ category?: string }, {}, {}, {}>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { category } = req.params;
  try {
    const categories = await CategoriesService.getCategoryByName(category!);

    res.status(200).send({
      message: `Categories fetched successfully.`,
      data: categories,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}
