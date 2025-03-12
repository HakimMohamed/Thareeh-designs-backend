// models/User.ts
import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface ISession extends Document {
  _id: ObjectId;
  _user: ObjectId;
  key: string;
  status: 'active' | 'completed';
}

const cartSchema: Schema = new Schema<ISession>(
  {
    _user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    key: { type: String, required: true },
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

cartSchema.index({ _user: 1, key: 1 });

const Cart = mongoose.model<ISession>('Session', cartSchema, 'Sessions');

export default Cart;
