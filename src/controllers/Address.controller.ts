import { NextFunction, Request, Response } from 'express';
import AddressService from '../services/Address.service';
import { GetCountriesResponse, GetUserAddressesResponse } from '../types/address';
import { CreateNewAddressDto } from '../dtos/address.dto';
import { IUser } from '../models/User';

export async function getCountries(
  req: Request,
  res: Response<GetCountriesResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const countries = await AddressService.getCountries();

    res.status(200).send({
      message: `Countries fetched successfully.`,
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
      message: `Address created successfully.`,
      data: null,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function getUserAddresses(
  req: Request,
  res: Response<GetUserAddressesResponse>,
  next: NextFunction
): Promise<void> {
  const userId = req.user?.userId!;

  try {
    const addresses = await AddressService.getUserAddresses(userId);

    res.status(200).send({
      message: `Addresses fetched successfully.`,
      data: addresses,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}
