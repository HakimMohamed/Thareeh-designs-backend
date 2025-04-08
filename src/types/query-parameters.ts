export interface GetItemsQueryParams {
  page?: string;
  pageSize?: string;
  category?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  text?: string;
}
export interface GetItemByIdQueryParams {
  id?: string;
}

export interface FeaturedItemsDto {
  pageSize?: string;
  excludeId?: string;
  cartItems?: string;
}

export interface GetItemsSearchResultsDto {
  text?: string;
}
