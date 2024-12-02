import { ICountry } from '../models/Country';
import Country from '../models/Country';
class AddressService {
  async getCountries(): Promise<ICountry[] | null> {
    return Country.find({}).lean<ICountry[] | null>();
  }
}

export default new AddressService();
