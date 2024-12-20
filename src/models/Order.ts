// models/User.ts
import mongoose, { Document, ObjectId, Schema, Types } from 'mongoose';
import { IItem, itemsSchema } from './Item';
import { addressSchema, IUser } from './User';
import { ICartItem, IFormattedCart } from './Cart';

export interface IOrder {
  _id: Types.ObjectId;
  _user: Types.ObjectId;
  items: IFormattedCart['items'];
  status: 'pending' | 'active' | 'completed';
  shippingAddress: Omit<IUser['addresses'][0], '_id'>;
  payment: {
    method: 'online' | 'cod';
    status: string;
  };
  price: {
    total: number;
    shipping: number;
  };
}

const orderSchema: Schema = new Schema<IOrder>(
  {
    _user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: 'asc',
    },
    items: itemsSchema,
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
    shippingAddress: addressSchema,
    payment: {
      method: { type: String, enum: ['online', 'cod'], required: true },
      status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    },
    price: {
      total: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<IOrder>('Order', orderSchema, 'Orders');

export default Order;
