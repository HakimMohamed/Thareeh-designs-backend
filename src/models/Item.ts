import { Schema, model, Document, NumberExpression, ObjectId } from 'mongoose';

export interface IItem extends Document {
  _id: ObjectId;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  discount?: {
    active: boolean;
    value: number;
  };
}

export const itemsSchema = new Schema<IItem>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true, ref: 'Category' },
    discount: {
      active: { type: Boolean, default: false },
      value: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

itemsSchema.index({ price: 'asc' });

const Item = model<IItem>('Item', itemsSchema, 'Items');

export default Item;
