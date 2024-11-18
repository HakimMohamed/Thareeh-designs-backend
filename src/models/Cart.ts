// models/User.ts
import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface ICart extends Document {
  _id: ObjectId;
  _user: ObjectId;
  items: ObjectId[];
  status: string;
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
