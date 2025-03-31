import { IBanner } from '../models/Banner';
import { ICountry } from '../models/Country';
import BannerSetting from '../models/Banner';

class BannerService {
  async getBannerSettings(): Promise<IBanner | null> {
    return BannerSetting.findOne({});
  }
}

export default new BannerService();
