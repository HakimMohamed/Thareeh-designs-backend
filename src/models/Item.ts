import { Schema, model, Document } from 'mongoose';

export interface IItem extends Document {
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

const itemsSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true, ref: 'Category' },
  },
  { timestamps: true }
);

const ItemSchema = model<IItem>('Item', itemsSchema, 'Items');

export default ItemSchema;
