// models/User.ts
import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: ObjectId;
  email: string;
  name: { first: string; last: string };
  password: string;
  refreshToken: string | null;
  addresses: {
    city: string;
    country: string;
    name: { first: string; last: string };
    phone: string;
    postalCode?: string;
    region: string;
  }[];
}
export const addressSchema: Schema = new Schema({
  city: { type: String, required: true },
  country: { type: String, required: true },
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  phone: { type: String, required: true },
  postalCode: { type: String },
  region: { type: String, required: true },
});

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: 'asc',
    },
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true },
    },
    password: { type: String, required: true },
    refreshToken: { type: String, default: null, index: 'asc' },
    addresses: {
      type: [addressSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>('User', userSchema, 'Users');

export default User;
