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
  async getFeaturedItems(excludeId: string, pageSize: number): Promise<IItem[] | []> {
    const randomDocs: IItem[] | [] = await Item.aggregate([
      { $match: { _id: { $ne: toObjectId(excludeId) } } },
      { $sample: { size: pageSize } },
    ]);

    return randomDocs;
  }
}

export default new ItemService();
