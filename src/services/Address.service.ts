import { UpdateResult } from 'mongoose';
import { ICountry } from '../models/Country';
import Country from '../models/Country';
import User, { IUser } from '../models/User';
import { toObjectId } from '../utils/helpers';
class AddressService {
  async getCountries(): Promise<ICountry[] | null> {
    return Country.find({}).lean<ICountry[] | null>();
  }

  async createNewUserAddress({
    email,
    city,
    country,
    name,
    phone,
    region,
    postalCode,
  }: {
    email: string;
    city: string;
    country: string;
    name: { first: string; last: string };
    phone: string;
    region: string;
    postalCode?: string;
  }): Promise<UpdateResult> {
    return User.updateOne(
      { email },
      { $push: { addresses: { city, country, name, phone, region, postalCode } } }
    );
  }

  async getUserAddresses(userId: string): Promise<IUser['addresses'] | []> {
    const user = await User.findOne(
      { _id: toObjectId(userId) },
      { addresses: 1 }
    ).lean<IUser | null>();

    return user?.addresses || [];
  }

  async getUserAddressById(
    userId: string,
    addressId: string
  ): Promise<IUser['addresses'][0] | null> {
    const user = await User.findOne(
      { _id: toObjectId(userId) },
      {
        addresses: 1,
      }
    ).lean<IUser | null>();

    const address = user?.addresses.find(a => a?._id.toString() === addressId);

    return address || null;
  }
}

export default new AddressService();
