// models/User.ts
import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: ObjectId;
  email: string;
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
    },
    verified: { required: true, type: Boolean, default: false },
    password: { type: String, required: true },
    refreshToken: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>('User', userSchema, 'Users');

export default User;
