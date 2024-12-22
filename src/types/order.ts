import { IOrder } from '../models/Order';
import { BaseResponse } from './response';

export interface GetUserOrdersResponse extends BaseResponse {
  data: IOrder[] | null;
}

export interface GetUserOrderByIdResponse extends BaseResponse {
  data: IOrder | null;
}
export interface CreateOrderResponse extends BaseResponse {
  data: IOrder | null;
}
