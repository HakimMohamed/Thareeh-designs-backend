// models/User.ts
import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface IUserOtp extends Document {
  _id: ObjectId;
  email: string;
  otpEntered: boolean;
  trials: number;
  otp: string;
}

const userOtpSchema: Schema = new Schema(
  {
    email: { type: String },
    otpEntered: { type: Boolean, default: false },
    trials: { type: Number, default: 0 },
    otp: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUserOtp>('UserOtp', userOtpSchema, 'UserOtps');

export default User;