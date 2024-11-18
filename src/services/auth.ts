import User, { IUser } from '../models/User';
import UserOtp, { IUserOtp } from '../models/UserOtp';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ObjectId } from 'mongoose';
import { SendMailOptions, Transporter } from 'nodemailer';
import createEmailTransporter from '../config/nodeMailer';
import LoggingService from './logs';
import { toObjectId, formatEgyptianTime } from '../utils/helpers';

class UserService {
  private transporter: Transporter;

  constructor() {
    this.transporter = createEmailTransporter();
  }
  async register(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
    }) as IUser;

    const { accessToken, refreshToken } = this.generateTokens(user._id.toString());

    user.refreshToken = refreshToken;

    await user.save();

    return { accessToken, refreshToken };
  }
  async validateRefreshToken(refreshToken: string): Promise<IUser | null> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as {
        userId: string;
      };

      const user = await User.findById(decoded.userId).lean();

      if (!user || user.refreshToken !== refreshToken) {
        return null;
      }

      return user as IUser;
    } catch (error) {
      return null;
    }
  }
  generateTokens(userId: string): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken(userId),
      refreshToken: this.generateRefreshToken(userId),
    };
  }
  generateAccessToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRY,
    });
  }
  generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
  }
  async checkUserExistance(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() }).lean<IUser | null>();
  }
  async checkEmailExistance(email: string): Promise<IUser | null> {
    return User.findOne({ email }).lean<IUser | null>();
  }
  async getUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).lean<IUser | null>();
  }
  async getUserById(id: string): Promise<IUser | null> {
    return User.findOne({ _id: toObjectId(id) }).lean<IUser | null>();
  }
  async validateUser(user: IUser, password: string): Promise<Boolean> {
    return bcrypt.compare(password, user.password);
  }

  async hashOTP(otp: number): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(otp.toString(), saltRounds);
  }

  generateOTP(): number {
    return crypto.randomInt(1000, 9999 + 1);
  }

  async sendOTPEmail(email: string, otp: string): Promise<void> {
    const message = `Your OTP code is: ${otp}`;
    const mailOptions: SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Confirmation',
      text: message,
      html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async getUserOtpByDate({
    email,
    date,
  }: {
    email?: string;
    date: Date;
  }): Promise<IUserOtp | null> {
    const match: any = {
      createdAt: { $gte: date },
      otpEntered: false,
    };

    match.email = email;

    return UserOtp.findOne().lean<IUserOtp | null>();
  }
  async sendOtp(email: string): Promise<void> {
    const tenMinutesAgo = new Date(new Date().getTime() - 10 * 60 * 1000);

    const formattedDate = formatEgyptianTime(tenMinutesAgo);

    const otpDoc = await this.getUserOtpByDate({ email, date: formattedDate });

    if (!otpDoc || (otpDoc && !(otpDoc.trials >= 4))) {
      const otp = await this.generateOTP();

      this.sendOTPEmail(email, otp.toString()).catch(err => {
        const logger = LoggingService.getInstance();
        logger.logError(err);
      });

      await UserOtp.updateOne(
        {
          email,
          otpEntered: false,
          createdAt: { $gte: tenMinutesAgo },
        },
        {
          $inc: { trials: 1 },
          $set: { otp: await this.hashOTP(otp) },
        },
        {
          upsert: true,
        }
      );
    } else {
      return Promise.reject('Blocked For 10 minutes due to multiple failed attempts.');
    }
  }
  async verifyUserOtp(otpDocId: ObjectId): Promise<void> {
    await UserOtp.updateOne({ _id: otpDocId }, { otpEntered: true });
  }
  async verifyUser(userId: ObjectId): Promise<void> {
    await UserOtp.updateOne({ _id: userId }, { verified: true });
  }
  async removeRefreshTokenFromUser(userId: string): Promise<void> {
    await User.updateOne({ _id: userId }, { refreshToken: '' });
  }
}

export default new UserService();
