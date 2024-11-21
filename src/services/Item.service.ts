import { ObjectId } from 'mongoose';
import Item, { IItem } from '../models/Item';
import { toObjectId } from '../utils/helpers';
import { ICartItem } from '../models/Cart';
class ItemService {
  async getItems(page: number, pageSize: number): Promise<{ items: IItem[]; count: number }> {
    const match = {};

    const [items, count]: [IItem[], number] = await Promise.all([
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
    ]);

    return { items, count };
  }

  async getItemById(id: string): Promise<IItem | null> {
    return Item.findOne({ _id: toObjectId(id) }).lean<IItem | null>();
  }
  async getItemsByIds(itemsIds: String[]): Promise<IItem[] | null> {
    return Item.find({ _id: { $in: itemsIds } }).lean<IItem[] | null>();
  }
  async getFeaturedItems(excludeId: string, pageSize: number): Promise<IItem[] | []> {
    const randomDocs: IItem[] | [] = await Item.aggregate([
      { $match: { _id: { $ne: toObjectId(excludeId) } } },
      { $sample: { size: pageSize } },
    ]);

    return randomDocs;
  }
}

export default new ItemService();
