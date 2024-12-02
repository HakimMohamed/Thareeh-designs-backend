import User, { IUser } from '../models/User';
import UserOtp, { IUserOtp } from '../models/UserOtp';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ObjectId, UpdateResult } from 'mongoose';
import { SendMailOptions, Transporter } from 'nodemailer';
import createEmailTransporter from '../config/nodeMailer';
import LoggingService from './Log.service';
import { toObjectId, formatEgyptianTime } from '../utils/helpers';

class UserService {
  private transporter: Transporter;

  constructor() {
    this.transporter = createEmailTransporter();
  }
  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<{ accessToken: string; refreshToken: string; userId: ObjectId }> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      name: {
        first: firstName,
        last: lastName,
      },
      password: hashedPassword,
    }) as IUser;

    const { accessToken, refreshToken } = this.generateTokens(
      user._id.toString(),
      email,
      firstName,
      lastName
    );

    user.refreshToken = refreshToken;

    await user.save();

    return { accessToken, refreshToken, userId: user._id };
  }
  async validateRefreshToken(refreshToken: string): Promise<IUser | null> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as {
        userId: string;
      };

      const user = await User.findById(decoded.userId).lean();

      if (user?.refreshToken !== refreshToken) {
        return null;
      }

      return user as IUser;
    } catch (error) {
      return null;
    }
  }
  generateTokens(
    userId: string,
    email: string,
    firstName: string,
    lastName: string
  ): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken(userId, email, firstName, lastName),
      refreshToken: this.generateRefreshToken(userId, email, firstName, lastName),
    };
  }
  generateAccessToken(userId: string, email: string, firstName: string, lastName: string): string {
    return jwt.sign({ userId, email }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRY,
    });
  }
  generateRefreshToken(userId: string, email: string, firstName: string, lastName: string): string {
    return jwt.sign({ userId, email }, process.env.JWT_SECRET!, {
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
    return User.findOne({ _id: toObjectId(id) }, { password: 0 }).lean<IUser | null>();
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

  async getUserOtpByDate({ email }: { email?: string }): Promise<IUserOtp | null> {
    const match: any = {
      otpEntered: false,
    };

    const tenMinutesAgo = new Date(new Date().getTime() - 10 * 60 * 1000);

    match.createdAt = { $gte: tenMinutesAgo };

    match.email = email;

    return UserOtp.findOne(match).sort({ createdAt: -1 }).lean<IUserOtp | null>();
  }
  async sendOtp(email: string): Promise<void> {
    const tenMinutesAgo = new Date(new Date().getTime() - 10 * 60 * 1000);

    const otpDoc = await this.getUserOtpByDate({ email });

    if (!otpDoc || (otpDoc && !(otpDoc.trials >= 3))) {
      const otp = this.generateOTP();
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
      throw new Error('Blocked For 10 minutes due to multiple failed attempts.');
    }
  }
  async verifyUserOtp(otpDocId: ObjectId): Promise<void> {
    await UserOtp.updateOne({ _id: otpDocId }, { otpEntered: true });
  }
  async verifyUser(userId: ObjectId, refreshToken: string): Promise<UpdateResult> {
    return User.updateOne({ _id: userId }, { refreshToken });
  }
  async removeRefreshTokenFromUser(userId: string): Promise<void> {
    await User.updateOne({ _id: userId }, { refreshToken: '' });
  }
  async increaseOtpAttempts(email: string): Promise<UpdateResult> {
    return UserOtp.updateOne({ email }, { $inc: { trials: 1 } });
  }
}

export default new UserService();
