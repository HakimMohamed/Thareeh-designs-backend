import { IOrder } from '../models/Order';
import { BaseResponse } from './response';

export interface GetUserOrdersResponse extends BaseResponse {
  data: IOrder[] | null;
}
