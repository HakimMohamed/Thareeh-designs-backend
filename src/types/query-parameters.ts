export interface GetItemsQueryParams {
  page?: string;
  pageSize?: string;
  categories?: string;
}
export interface GetItemByIdQueryParams {
  id?: string;
}

export interface FeaturedItemsDto {
  pageSize?: string;
  excludeId?: string;
  cartItems?: string;
}
