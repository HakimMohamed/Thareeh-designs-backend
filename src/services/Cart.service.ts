import Cart, { ICart, ICartItem, IFormattedCart } from '../models/Cart';
import { IItem } from '../models/Item';
import { toObjectId } from '../utils/helpers';
import { DeleteResult, UpdateResult } from 'mongoose';

class CartService {
  async createOrUpdateCart(
    items: IItem[],
    userId: string,
    cartItems: ICartItem[]
  ): Promise<UpdateResult> {
    const cartItemsMap = new Map(cartItems.map(item => [item._id.toString(), item]));

    const formattedItems = items
      .map(item => {
        const cartItem = cartItemsMap.get(item._id.toString());

        if (!cartItem) {
          return null;
        }

        return {
          _id: item._id,
          name: item.name,
          quantity: cartItem.quantity,
        };
      })
      .filter(Boolean);

    const match: any = {
      _user: toObjectId(userId),
      status: 'active',
    };

    return Cart.updateOne(
      match,
      {
        $set: {
          status: 'active',
          _user: toObjectId(userId),
          items: formattedItems,
        },
      },
      { upsert: true }
    );
  }

  async addItemToCart(item: IItem, userId: string, cartItems: ICartItem[]): Promise<UpdateResult> {
    const match: any = {
      _user: toObjectId(userId),
      status: 'active',
    };

    let update = {};

    const isItemInCart = cartItems.find(
      cartItem => cartItem._id.toString() === item._id.toString()
    );

    if (!isItemInCart) {
      update = {
        $push: {
          items: {
            _id: item._id,
            name: item.name,
            quantity: 1,
          },
        },
      };
    } else {
      const formattedItems = cartItems.map(cartItem => {
        if (cartItem._id.toString() === item._id.toString()) {
          return {
            _id: cartItem._id,
            name: cartItem.name,
            quantity: cartItem.quantity + 1,
          };
        }
        return cartItem;
      });

      update = {
        $set: {
          items: formattedItems,
        },
      };
    }

    return Cart.updateOne(match, update);
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
      } else {
        item.price = originalTotalPrice;
      }

      formattedCart.originalPrice += originalTotalPrice;
      formattedCart.price += item.price;

      formattedCart.items.push({
        _id: item._id,
        name: item.name,
        quantity: cartItem.quantity,
        price: item.price,
        image: item.image,
        discount: item.discount,
        originalPrice: originalTotalPrice,
      });
    });

    return formattedCart;
  }
  async removeItemFromCart(itemId: string, userId: string): Promise<UpdateResult> {
    return Cart.updateOne(
      { _user: toObjectId(userId), status: 'active' },
      { $pull: { items: { _id: toObjectId(itemId) } } }
    );
  }

  async clearUserCart(userId: string): Promise<DeleteResult> {
    return Cart.deleteOne({ _user: toObjectId(userId) });
  }

  async updateCartItemQuantity(
    itemId: string,
    quantity: number,
    userId: string
  ): Promise<UpdateResult> {
    return Cart.updateOne(
      { _user: toObjectId(userId), status: 'active', 'items._id': toObjectId(itemId) },
      { $set: { 'items.$.quantity': quantity } }
    );
  }

  async getUserUnformattedCart(userId: string): Promise<ICart | null> {
    return Cart.findOne({ _user: toObjectId(userId) }).lean<ICart | null>();
  }

  async completeCart(userId: string): Promise<UpdateResult> {
    return Cart.updateOne(
      { _user: toObjectId(userId), status: 'active' },
      { $set: { status: 'completed' } }
    );
  }
}

export default new CartService();
