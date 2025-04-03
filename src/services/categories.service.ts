import Category, { ICategory } from '../models/Category';

class CategoryService {
  async getCategories(): Promise<ICategory[]> {
    const categories = await Category.find({ active: true })
      .sort({ order: 1, _id: 1 })
      .lean<ICategory[]>();
    return categories;
  }
}

export default new CategoryService();
