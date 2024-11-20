import Cart, { ICart, IFormattedCart } from '../models/Cart';
import { IItem } from '../models/Item';
import { toObjectId } from '../utils/helpers';
import { DeleteResult, ObjectId, UpdateResult } from 'mongoose';

class CartService {
  async createOrUpdateCart(items: IItem[], userId: string): Promise<UpdateResult> {
    const match: any = {
      _user: toObjectId(userId),
      status: 'active',
    };

    return Cart.updateOne(match, {
      $set: {
        status: 'active',
        _user: toObjectId(userId),
        items: items.map(item => ({
          _id: item._id,
          name: item.name,
          quantity: 1,
        })),
      },
    });
  }

  async addItemToCart(item: IItem, cartId: ObjectId): Promise<UpdateResult> {
    const match: any = {
      _cart: cartId,
      status: 'active',
    };

    return Cart.updateOne(match, {
      $push: {
        items: item._id,
      },
    });
  }

  async removeCart(userId: string): Promise<DeleteResult> {
    return Cart.deleteOne({ _user: toObjectId(userId) });
  }
  async getUserCart(userId: string): Promise<ICart | null> {
    const pipeline = [
      {
        $match: {
          _user: toObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'Items',
          localField: 'items',
          foreignField: '_id',
          as: 'items',
        },
      },
    ];

    const cartWithItems = await Cart.aggregate<ICart>(pipeline);

    return cartWithItems.length > 0 ? cartWithItems[0] : null;
  }

  formatCart(cart: ICart, items: IItem[]): IFormattedCart {
    const formattedCart: IFormattedCart = {
      _id: cart._id,
      _user: cart._user,
      items,
      originalPrice: 0,
      price: 0,
      discountAmount: 0,
    };

    const { originalPrice, price, discountAmount } = items.reduce(
      (acc, item) => {
        const priceAfterDiscount = item?.priceAfterDiscount || item.price;
        acc.originalPrice += item.price;
        acc.price += priceAfterDiscount;
        acc.discountAmount += item.price - priceAfterDiscount;
        return acc;
      },
      { originalPrice: 0, price: 0, discountAmount: 0 }
    );

    formattedCart.originalPrice = originalPrice;
    formattedCart.price = price;
    formattedCart.discountAmount = discountAmount;

    return formattedCart;
  }

  async calculateCartPrice(items: IItem[]): Promise<void> {}
}

export default new CartService();
