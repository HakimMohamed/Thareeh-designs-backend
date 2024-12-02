import { ICountry } from '../models/Country';
import { BaseResponse } from './response';

export interface getCountriesResponse extends BaseResponse {
  data: ICountry[] | null;
}
