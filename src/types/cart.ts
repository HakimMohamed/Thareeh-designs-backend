import { IFormattedCart } from '../models/Cart';
import { BaseResponse } from './response';

export interface CreateOrUpdateCartResponse extends BaseResponse {
  data: IFormattedCart | null;
}

export interface AddItemToCartResponse extends BaseResponse {
  data: null;
}
