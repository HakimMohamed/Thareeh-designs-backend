import { Schema, model, Document, NumberExpression } from 'mongoose';

export interface IItem extends Document {
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  priceAfterDiscount?: number;
  discount?: {
    active: boolean;
    value: number;
  };
}

const itemsSchema = new Schema(
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

const ItemSchema = model<IItem>('Item', itemsSchema, 'Items');

export default ItemSchema;
