import Item, { IItem } from '../models/Item';
class ItemService {
  async getItems(page: number, pageSize: number): Promise<IItem[] | null> {
    const match = {};

    const items = (await Item.find(match)
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .lean()) as IItem[] | null;

    return items;
  }
}

export default new ItemService();
