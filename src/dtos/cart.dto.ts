import { ICartItem } from '../models/Cart';

export interface CreateOrUpdateDto {
  items: ICartItem[];
}

export interface AddItemToCartDto {
  itemId: string;
}

export interface RemoveItemFromCartDto {
  itemId: string;
}

export interface UpdateItemQuantityDto {
  itemId: string;
  quantity: number;
}
