import { NextFunction, Request, Response } from 'express';
import { UpdateUserAddressDto } from '../dtos/address.dto';
import BannerService from '../services/Banner.service';

export async function getBannerSettings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const bannerSettings = await BannerService.getBannerSettings();
    const { text = '', color = '', textColor } = bannerSettings || {};

    res.status(200).send({
      message: `Countries fetched successfully.`,
      data: {
        text,
        color,
        textColor,
      },
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}
