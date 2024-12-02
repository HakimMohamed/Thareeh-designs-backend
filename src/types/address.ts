import { ICountry } from '../models/Country';
import { IUser } from '../models/User';
import { BaseResponse } from './response';

export interface GetCountriesResponse extends BaseResponse {
  data: ICountry[] | null;
}

export interface GetUserAddressesResponse extends BaseResponse {
  data: IUser['addresses'] | [];
}
