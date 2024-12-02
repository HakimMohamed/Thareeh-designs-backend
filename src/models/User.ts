// models/User.ts
import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: ObjectId;
  email: string;
  name: { first: string; last: string };
  password: string;
  refreshToken: string | null;
  verified: boolean;
}

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
    verified: { required: true, type: Boolean, default: false },
    password: { type: String, required: true },
    refreshToken: { type: String, default: null, index: 'asc' },
    addresses: {
      type: [
        {
          city: { type: String, required: true },
          country: { type: String, required: true },
          firstName: { type: String, required: true },
          lastName: { type: String, required: true },
          phone: { type: String, required: true },
          postalCode: { type: String, required: true },
          region: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>('User', userSchema, 'Users');

export default User;
