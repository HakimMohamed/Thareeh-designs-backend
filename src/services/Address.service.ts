import { ObjectId, UpdateResult } from 'mongoose';
import { ICountry } from '../models/Country';
import Country from '../models/Country';
import User, { IUser, IUserAddress } from '../models/User';
import { toObjectId } from '../utils/helpers';
import { CreateNewAddressDto, UpdateUserAddressDto } from '../dtos/address.dto';
class AddressService {
  async getCountries(): Promise<ICountry[] | null> {
    return Country.find({}).lean<ICountry[] | null>();
  }

  async createNewUserAddress(
    userId: string,
    { city, country, name, phone, region, postalCode, type, details }: CreateNewAddressDto
  ): Promise<UpdateResult> {
    return User.updateOne(
      { _id: toObjectId(userId) },
      { $push: { addresses: { city, country, name, phone, region, postalCode, type, details } } }
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

  async removeUserAddress(userId: string, addressId: string): Promise<UpdateResult> {
    return User.updateOne(
      { _id: toObjectId(userId) },
      { $pull: { addresses: { _id: toObjectId(addressId) } } }
    );
  }

  async updateUserAddress(userId: string, newAddress: UpdateUserAddressDto): Promise<UpdateResult> {
    const formattedAddressUpdates: IUserAddress = {
      ...newAddress,
      _id: toObjectId(newAddress._id),
    };

    return User.updateOne(
      { _id: toObjectId(userId), 'addresses._id': newAddress._id },
      { $set: { 'addresses.$': formattedAddressUpdates } }
    );
  }
}

export default new AddressService();
