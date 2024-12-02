import { ICountry } from '../models/Country';
import { BaseResponse } from './response';

export interface GetCountriesResponse extends BaseResponse {
  data: ICountry[] | null;
}
