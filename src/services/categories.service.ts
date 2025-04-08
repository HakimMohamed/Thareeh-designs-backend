import Category, { ICategory } from '../models/Category';

class CategoryService {
  async getCategories(): Promise<ICategory[]> {
    const categories = await Category.find({ active: true })
      .sort({ order: 1, _id: 1 })
      .lean<ICategory[]>();
    return categories;
  }
  async getCategoryByName(categoryName: string): Promise<ICategory | null> {
    const category = await Category.findOne({
      name: categoryName,
      active: true,
    }).lean<ICategory | null>();
    return category;
  }
}

export default new CategoryService();
