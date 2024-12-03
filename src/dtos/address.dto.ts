export interface CreateNewAddressDto {
  email: string;
  city: string;
  country: string;
  name: {
    first: string;
    last: string;
  };
  phone: string;
  postalCode?: string;
  region: string;
}

export interface GetUserAddressByIdDto {
  id?: string;
}

export interface RemoveUserAddressDto {
  id?: string;
}
