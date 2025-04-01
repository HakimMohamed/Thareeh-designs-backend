// models/User.ts
import mongoose, { Document, ObjectId, Schema, Types } from 'mongoose';
import { addressSchema, IUser } from './User';
import { ICartItem, IFormattedCart } from './Cart';

export interface IOrder {
  _id: Types.ObjectId;
  user: {
    _id: Types.ObjectId;
    name: IUser['name'];
    email: IUser['email'];
  };
  items: IFormattedCart['items'];
  status: 'pending' | 'active' | 'delivered' | 'cancelled';
  shippingAddress: Omit<IUser['addresses'][0], '_id'>;
  payment: {
    method: 'online' | 'cod';
    status: 'pending' | 'success';
  };
  price: {
    total: number;
    shipping: number;
    discount: number;
    tax: number;
  };
}

const orderSchema: Schema = new Schema<IOrder>(
  {
    user: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: 'asc' },
      name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
      },
      email: { type: String, required: true },
    },
    items: [
      {
        type: {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
          name: { type: String, required: true },
          quantity: { type: Number, required: true, default: 1 },
          originalPrice: { type: Number, required: true },
          price: { type: Number, required: true },
          image: { type: String, required: true },
          discount: {
            active: { type: Boolean, default: false },
            value: { type: Number, default: 0 },
          },
        },
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'active', 'delivered', 'cancelled'],
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
