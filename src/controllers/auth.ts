import { NextFunction, Request, Response } from 'express';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  CompleteRegisterationDto,
  LogoutDto,
  VerifyEmailDto,
} from '../dtos/auth.dto';
import {
  AuthDataResponse,
  CompleteRegisterationSchema,
  LogOutResponse,
  RefreshTokenResponse,
  RequestEmailOTPResponse,
  VerifyEmailResponse,
} from '../types/auth';
import AuthService from '../services/auth';
import bcrypt from 'bcryptjs';
import { formatEgyptianTime } from '../utils/helpers';

export async function register(
  req: Request<{}, {}, RegisterDto>,
  res: Response<AuthDataResponse>,
  next: NextFunction
): Promise<void> {
  const { email } = req.body;

  try {
    const existingUser = await AuthService.checkEmailExistance(email);

    if (existingUser) {
      res.status(409).json({
        message: 'Email number already in use.',
        success: false,
        data: null,
      });
      return;
    }

    await AuthService.sendOtp(email);

    res.status(200).send({
      message: `Otp sent to ${email}.`,
      data: null,
      success: true,
    });
  } catch (error: any) {
    if (error === 'Blocked For 10 minutes due to multiple failed attempts.') {
      res.status(403).json({
        message: error,
        success: false,
        data: null,
      });
      return;
    }
    next(error);
  }
}

export async function completeRegsitration(
  req: Request<{}, {}, CompleteRegisterationDto>,
  res: Response<CompleteRegisterationSchema>,
  next: NextFunction
): Promise<void> {
  const { email, password, otp } = req.body;

  try {
    const existingUser = await AuthService.checkUserExistance(email);

    if (existingUser) {
      res.status(409).json({
        message: 'Email already in use.',
        success: false,
        data: null,
      });
      return;
    }

    const tenMinutesAgo = new Date(new Date().getTime() - 10 * 60 * 1000);

    const formattedDate = formatEgyptianTime(tenMinutesAgo);

    const otpDoc = await AuthService.getUserOtpByDate({ email, date: formattedDate });

    if (!otpDoc) {
      res.status(410).json({
        message: 'OTP expired.',
        success: false,
        data: null,
      });
      return;
    }

    const isMatch = await bcrypt.compare(otp, otpDoc.otp);

    if (!isMatch) {
      res.status(403).json({
        message: 'Invalid OTP.',
        success: false,
        data: null,
      });
      return;
    }

    const { refreshToken, accessToken } = await AuthService.register(email, password);

    await AuthService.verifyUserOtp(otpDoc._id);

    res.send({
      message: 'Register successful.',
      data: {
        refreshToken,
        accessToken,
      },
      success: true,
    });
  } catch (error: any) {
    if (error && error.code === 'E11000') {
      res.status(409).json({
        message: 'Email already in use.',
        success: false,
        data: null,
      });
      return;
    }
    next(error);
  }
}

export async function verifyEmail(
  req: Request<{}, {}, VerifyEmailDto>,
  res: Response<VerifyEmailResponse>,
  next: NextFunction
): Promise<void> {
  const { email, otp } = req.body;
  try {
    const user = await AuthService.getUserByEmail(email);

    if (!user) {
      res.status(404).send({
        message: `No user found with email ${email}.`,
        data: null,
        success: true,
      });
      return;
    }

    const tenMinutesAgo = new Date(new Date().getTime() - 10 * 60 * 1000);

    const formattedDate = formatEgyptianTime(tenMinutesAgo);

    const otpDoc = await AuthService.getUserOtpByDate({ email, date: formattedDate });

    if (!otpDoc) {
      res.status(410).json({
        message: 'OTP expired.',
        success: false,
        data: null,
      });
      return;
    }

    const isMatch = await bcrypt.compare(otp, otpDoc.otp);

    if (!isMatch) {
      res.status(403).json({
        message: 'Invalid OTP.',
        success: false,
        data: null,
      });
      return;
    }

    const promises = [AuthService.verifyUserOtp(otpDoc._id)];

    if (!user.verified) promises.push(AuthService.verifyUser(user._id));

    await Promise.all(promises);

    const { refreshToken, accessToken } = AuthService.generateTokens(user._id.toString());

    res.status(200).send({
      message: 'Email verified successfully.',
      data: {
        refreshToken,
        accessToken,
      },
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function login(
  req: Request<{}, {}, LoginDto>,
  res: Response<AuthDataResponse>,
  next: NextFunction
): Promise<void> {
  const { email, password } = req.body;

  try {
    const user = await AuthService.getUserByEmail(email);
    if (!user) {
      res.status(401).send({
        message: 'Either email or password is incorrect.',
        data: null,
        success: false,
      });
      return;
    }

    const isPasswordValid = await AuthService.validateUser(user, password);
    if (!isPasswordValid) {
      res.status(401).send({
        message: 'Either email or password is incorrect.',
        data: null,
        success: false,
      });
      return;
    }

    await AuthService.sendOtp(email);

    res.send({
      message: `Otp sent to ${email}.`,
      data: null,
      success: true,
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshAccessToken(
  req: Request<{}, {}, RefreshTokenDto>,
  res: Response<RefreshTokenResponse>,
  next: NextFunction
): Promise<void> {
  const { refreshToken } = req.body;

  try {
    const user = await AuthService.validateRefreshToken(refreshToken);

    if (!user) {
      res.status(403).send({
        message: 'Invalid refresh token.',
        data: null,
        success: false,
      });
      return;
    }

    const newAccessToken = AuthService.generateAccessToken(user._id.toString());

    res.send({
      message: 'Access token refreshed successfully.',
      data: {
        accessToken: newAccessToken,
      },
      success: true,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(
  req: Request<{}, {}, LogoutDto>,
  res: Response<LogOutResponse>,
  next: NextFunction
) {
  try {
    const refreshToken = req.body.refreshToken;

    const user = await AuthService.validateRefreshToken(refreshToken);

    if (!user) {
      res.status(403).send({
        message: 'Invalid refresh token.',
        data: null,
        success: false,
      });
      return;
    }

    await AuthService.removeRefreshTokenFromUser(user._id.toString());

    res.status(200).send({
      message: 'Logout successful',
      data: null,
      success: true,
    });
  } catch (error) {
    next(error);
  }
}
