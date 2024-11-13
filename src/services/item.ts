import Item, { IItem } from '../models/Item';
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
}

export default new ItemService();
