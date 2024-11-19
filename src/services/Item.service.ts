import { ObjectId } from 'mongoose';
import Item, { IItem } from '../models/Item';
import { toObjectId } from '../utils/helpers';
class ItemService {
  async getItems(page: number, pageSize: number): Promise<{ items: IItem[]; count: number }> {
    const match = {};

    const [items, count]: [IItem[], number] = await Promise.all([
      Item.find(match)
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .lean<IItem[]>(),
      Item.countDocuments(match),
    ]);

    return { items, count };
  }

  async getItemById(id: string): Promise<IItem | null> {
    return Item.findById(id).lean<IItem | null>();
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
  applyDiscountToItems(items: IItem[]): IItem[] {
    return items.map(item => {
      const discount = item.discount;

      if (discount?.active && discount.value > 0) {
        item.priceAfterDiscount = item.price - item.price * (discount.value / 100);
      } else {
        item.priceAfterDiscount = item.price;
      }

      return item;
    });
  }
}

export default new ItemService();
