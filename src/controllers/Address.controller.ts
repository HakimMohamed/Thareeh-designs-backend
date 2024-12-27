import { NextFunction, Request, Response } from 'express';
import AddressService from '../services/Address.service';
import {
  GetCountriesResponse,
  GetUserAddressByIdResponse,
  GetUserAddressesResponse,
} from '../types/address';
import {
  CreateNewAddressDto,
  GetUserAddressByIdDto,
  RemoveUserAddressDto,
  UpdateUserAddressDto,
} from '../dtos/address.dto';

export async function updateUserAddress(
  req: Request<{}, {}, UpdateUserAddressDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const newAddress = req.body;

  const userId = req.user?.userId!;

  try {
    await AddressService.updateUserAddress(userId, newAddress);

    res.status(200).send({
      message: `Countries fetched successfully.`,
      data: null,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}

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
  const userId = req.user?.userId!;

  try {
    await AddressService.createNewUserAddress(userId, req.body);

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

export async function getUserAddressById(
  req: Request<{}, {}, {}, GetUserAddressByIdDto>,
  res: Response<GetUserAddressByIdResponse>,
  next: NextFunction
): Promise<void> {
  const { id } = req.query;

  const userId = req.user?.userId!;

  try {
    const address = await AddressService.getUserAddressById(userId, id as string);

    res.status(200).send({
      message: `Addresses fetched successfully.`,
      data: address,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function removeUserAddress(
  req: Request<{}, {}, {}, RemoveUserAddressDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { id } = req.query;

  const userId = req.user?.userId!;

  try {
    await AddressService.removeUserAddress(userId, id as string);

    res.status(200).send({
      message: `Addresses deleted successfully.`,
      data: null,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}
