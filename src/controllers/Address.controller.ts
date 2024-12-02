import { NextFunction, Request, Response } from 'express';
import AddressService from '../services/Address.service';
import { getCountriesResponse } from '../types/address';

export async function getCountries(
  req: Request,
  res: Response<getCountriesResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const countries = await AddressService.getCountries();

    res.status(200).send({
      message: `Cart cleared successfully.`,
      data: countries,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}
