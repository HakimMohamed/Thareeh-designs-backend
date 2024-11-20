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
    return Cart.findOne({ _user: toObjectId(userId) }).lean<ICart | null>();
  }

  formatCart(cart: ICart, items: IItem[]): IFormattedCart {
    const formattedCart: IFormattedCart = {
      _id: cart._id,
      _user: cart._user,
      items: [],
      originalPrice: 0,
      price: 0,
    };

    const cartItemsMap = new Map(cart.items.map(item => [item._id.toString(), item]));

    items.forEach((item: IItem) => {
      const cartItem = cartItemsMap.get(item._id.toString());

      if (!cartItem) {
        return null;
      }

      const originalTotalPrice = item.price * cartItem.quantity;

      if (item.discount?.active && item.discount.value > 0) {
        item.price = Math.max(
          originalTotalPrice - originalTotalPrice * (item.discount.value / 100),
          0
        );
      }

      formattedCart.originalPrice += originalTotalPrice;
      formattedCart.price += item.price;

      formattedCart.items.push({
        _id: item._id,
        name: item.name,
        quantity: cartItem.quantity,
        price: item.price,
        originalPrice: originalTotalPrice,
      });
    });

    return formattedCart;
  }
}

export default new CartService();
