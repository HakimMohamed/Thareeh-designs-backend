import { IItem } from '../models/Item';
import { BaseResponse } from './response';

export interface GetItemsResponse extends BaseResponse {
  data: { items: IItem[]; count: number; filters: string[] } | null;
}

export interface GetItemByIdResponse extends BaseResponse {
  data: IItem | null;
}

export interface GetFeaturedItemsResponse extends BaseResponse {
  data: IItem[] | null;
}

export interface GetItemsSearchResultsResponse extends BaseResponse {
  data: IItem[] | null;
}
