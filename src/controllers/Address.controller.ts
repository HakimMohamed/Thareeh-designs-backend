import { NextFunction, Request, Response } from 'express';
import AddressService from '../services/Address.service';
import { GetCountriesResponse } from '../types/address';
import { CreateNewAddressDto } from '../dtos/address.dto';

export async function getCountries(
  req: Request,
  res: Response<GetCountriesResponse>,
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

export async function createNewUserAddress(
  req: Request<{}, {}, CreateNewAddressDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await AddressService.createNewUserAddress(req.body);

    res.status(200).send({
      message: `Cart cleared successfully.`,
      data: null,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}
