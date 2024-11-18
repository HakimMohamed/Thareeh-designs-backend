import Cart from '../models/Cart';
import { IItem } from '../models/Item';
import { toObjectId } from '../utils/helpers';
import { DeleteResult, UpdateResult } from 'mongoose';

class CartService {
  async createOrUpdateCart(item: IItem, userId: string): Promise<UpdateResult> {
    const match: any = {
      _user: toObjectId(userId),
      status: 'active',
    };

    return Cart.updateOne(
      match,
      {
        $push: { items: item._id },
        $set: {
          status: 'active',
          _user: toObjectId(userId),
        },
      },
      { upsert: true }
    );
  }

  async calculateCartPrice(items: IItem[]): Promise<void> {}

  async removeCart(userId: string): Promise<DeleteResult> {
    return Cart.deleteOne({ _user: toObjectId(userId) });
  }
}

export default new CartService();
