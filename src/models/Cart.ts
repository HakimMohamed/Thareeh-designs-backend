// models/User.ts
import mongoose, { Document, ObjectId, Schema } from 'mongoose';
import { IItem } from './Item';

export interface ICart extends Document {
  _id: ObjectId;
  _user: ObjectId;
  items: ObjectId[] | IItem[];
  status: string;
}

export interface IFormattedCart {
  _id: ObjectId;
  _user: ObjectId;
  items: IItem[];
  price: number;
  originalPrice: number;
  discountAmount: number;
}

const cartSchema: Schema = new Schema(
  {
    _user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model<ICart>('Cart', cartSchema, 'Carts');

export default Cart;
