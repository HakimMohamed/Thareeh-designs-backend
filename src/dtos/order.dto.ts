import { IOrder } from '../models/Order';
import { IUser } from '../models/User';

export interface GetUserOrdersDto {
  id?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateOrderDto {
  paymentMethod: IOrder['payment']['method'];
  address: IOrder['shippingAddress'];
  saveInfo?: boolean;
}

export interface CancelOrderDto {
  orderId: string;
}
