import { UpdateResult } from 'mongoose';
import { ICountry } from '../models/Country';
import Country from '../models/Country';
import User from '../models/User';
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
}

export default new AddressService();
