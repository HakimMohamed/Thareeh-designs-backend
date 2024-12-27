export interface CreateNewAddressDto {
  city: string;
  country: string;
  name: {
    first: string;
    last: string;
  };
  phone: string;
  postalCode?: string;
  region: string;
  type: 'office' | 'home';
  details: string;
}

export interface GetUserAddressByIdDto {
  id?: string;
}

export interface RemoveUserAddressDto {
  id?: string;
}

export interface UpdateUserAddressDto {
  _id: string;
  city: string;
  country: string;
  name: {
    first: string;
    last: string;
  };
  phone: string;
  postalCode?: string;
  region: string;
  type: 'office' | 'home';
  details: string;
}
