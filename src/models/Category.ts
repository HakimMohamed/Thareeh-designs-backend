import { Schema, model, Document, ObjectId } from 'mongoose';

export interface ICategory extends Document {
  _id: ObjectId;
  name: string;
  image: string;
  active: boolean;
  order: number;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
});

const Category = model<ICategory>('Category', categorySchema, 'Categories');

export default Category;
