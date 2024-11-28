// models/User.ts
import mongoose, { Document, ObjectId, Schema } from 'mongoose';
import { IItem } from './Item';

export interface ICart extends Document {
  _id: ObjectId;
  _user: ObjectId;
  items: ICartItem[];
  status: string;
}

export interface ICartItem {
  _id: ObjectId;
  name: string;
  quantity: number;
}

export interface IFormattedCart {
  _id: ObjectId;
  _user: ObjectId;
  items: {
    _id: ObjectId;
    name: string;
    quantity: number;
    originalPrice: number;
    price: number;
    image: string;
    discount?: {
      active: boolean;
      value: number;
    };
  }[];
  price: number;
  originalPrice: number;
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
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
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
