// models/User.ts
import mongoose, { Document, ObjectId, Schema } from 'mongoose';
import ItemSchema, { IItem } from './Item';

export interface IOrder extends Document {
  _id: ObjectId;
  _user: ObjectId;
  items: IItem[];
  status: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  payment: {
    method: string;
    status: string;
  };
  price: {
    total: number;
    shipping: number;
  };
}

const orderSchema: Schema = new Schema(
  {
    _user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: ItemSchema,
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, default: '' },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
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

orderSchema.index({ _user: 'asc' });

const Order = mongoose.model<IOrder>('Order', orderSchema, 'Orders');

export default Order;
