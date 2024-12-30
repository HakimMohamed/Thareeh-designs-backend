import Item, { IItem } from '../models/Item';
import { toObjectId } from '../utils/helpers';

class ItemService {
  async getItems(
    page: number,
    pageSize: number,
    categories: string[],
    sort: string,
    minPrice: number,
    maxPrice: number,
    text: string
  ): Promise<{ items: IItem[]; count: number; filters: string[] }> {
    const match: any = {};

    if (categories && categories.length > 0) {
      match.category = { $in: categories };
    }

    if (text) {
      match.name = { $regex: text, $options: 'i' };
    }

    const priceMatch: any = {};
    if (minPrice) priceMatch.$gte = minPrice;
    if (maxPrice) priceMatch.$lte = maxPrice;
    if (minPrice || maxPrice) match.price = priceMatch;

    const sortMap: { [key: string]: any } = {
      'price-low-to-high': { price: 1, _id: -1 },
      'price-high-to-low': { price: -1, _id: -1 },
    };

    const sortStage = sortMap[sort] || { _id: -1 };

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
        .sort(sortStage)
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

  async getItemsSearchResults(searchText: string): Promise<IItem[] | []> {
    return Item.find({ name: { $regex: searchText, $options: 'i' } })
      .sort({ _id: -1 })
      .limit(5)
      .lean<IItem[]>();
  }
}

export default new ItemService();
