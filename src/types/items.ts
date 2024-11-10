import { IItem } from '../models/Item';

export interface BaseResponse {
  message: string;
  success: boolean;
}

export interface GetItemsResponse extends BaseResponse {
  data: IItem[] | null;
}
