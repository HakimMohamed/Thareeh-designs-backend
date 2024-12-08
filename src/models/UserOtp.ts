// models/User.ts
import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface IUserOtp extends Document {
  _id: ObjectId;
  email: string;
  otpEntered: boolean;
  trials: number;
  otp: string;
}

const userOtpSchema: Schema = new Schema<IUserOtp>(
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

userOtpSchema.index({ email: 'asc', createdAt: 'asc' });

const User = mongoose.model<IUserOtp>('UserOtp', userOtpSchema, 'UserOtps');

export default User;
