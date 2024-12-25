import Item, { IItem } from '../models/Item';
import { toObjectId } from '../utils/helpers';

class ItemService {
  async getItems(
    page: number,
    pageSize: number,
    categories: string[]
  ): Promise<{ items: IItem[]; count: number; filters: string[] }> {
    const match: any = {};

    if (categories && categories.length > 0) {
      match.category = { $in: categories };
    }
    const [items, count, filters]: [IItem[], number, string[]] = await Promise.all([
      Item.find(match, {
        name: 1,
        price: 1,
        description: 1,
        image: 1,
        category: 1,
        discount: {
          'discount.value': { $ifNull: ['$discount.value', 0] },
          'discount.active': { $ifNull: ['$discount.active', false] },
        },
      })
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .lean<IItem[]>(),
      Item.countDocuments(match),
      Item.distinct('category'),
    ]);

    return { items, count, filters };
  }

  async getItemById(id: string): Promise<IItem | null> {
    return Item.findOne({ _id: toObjectId(id) }).lean<IItem | null>();
  }
  async getItemsByIds(itemsIds: String[]): Promise<IItem[] | null> {
    return Item.find({ _id: { $in: itemsIds } }).lean<IItem[] | null>();
  }
  async getFeaturedItems(
    pageSize: number,
    excludeId?: string,
    cartItems?: string[] | []
  ): Promise<IItem[] | []> {
    const match: any = {};

    if (excludeId) {
      match._id = { $ne: toObjectId(excludeId) };
    }

    if (cartItems && cartItems.length > 0) {
      match._id = { ...match._id, $nin: cartItems.map(item => toObjectId(item)) };
    }

    const randomDocs: IItem[] | [] = await Item.aggregate([
      {
        $match: match,
      },
      { $sample: { size: pageSize } },
    ]);

    return randomDocs;
  }
}

export default new ItemService();
