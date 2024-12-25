export interface GetItemsQueryParams {
  page?: string;
  pageSize?: string;
  categories?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
}
export interface GetItemByIdQueryParams {
  id?: string;
}

export interface FeaturedItemsDto {
  pageSize?: string;
  excludeId?: string;
  cartItems?: string;
}
