import { ICartItem } from '../models/Cart';

export interface CreateOrUpdateDto {
  items: ICartItem[];
}

export interface AddItemToCartDto {
  itemId: string;
}
