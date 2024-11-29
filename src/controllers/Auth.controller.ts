import { NextFunction, Request, Response } from 'express';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  CompleteRegisterationDto,
  LogoutDto,
  VerifyOtpDto,
} from '../dtos/auth.dto';
import {
  AuthDataResponse,
  CompleteRegisterationSchema,
  GetUserResponse,
  LogOutResponse,
  RefreshTokenResponse,
  VerifyOtpResponse,
} from '../types/auth';
import AuthService from '../services/Auth.service';
import bcrypt from 'bcryptjs';
import { formatEgyptianTime, toObjectId } from '../utils/helpers';

export async function getUser(
  req: Request,
  res: Response<GetUserResponse>,
  next: NextFunction
): Promise<void> {
  const userId = req.user?.userId!;

  try {
    const existingUser = await AuthService.getUserById(userId);

    res.status(200).send({
      message: `User fetched successfully.`,
      data: existingUser,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function register(
  req: Request<{}, {}, RegisterDto>,
  res: Response<AuthDataResponse>,
  next: NextFunction
): Promise<void> {
  const { email } = req.body;

  try {
    const existingUser = await AuthService.checkEmailExistance(email);

    if (existingUser) {
      res.status(409).send({
        message: 'Email already in use.',
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
    if (error.message === 'Blocked For 10 minutes due to multiple failed attempts.') {
      res.status(403).send({
        message: error.message,
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
  const { email, password, otp, firstName, lastName } = req.body;

  try {
    const existingUser = await AuthService.checkUserExistance(email);

    if (existingUser) {
      res.status(409).send({
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
      res.status(410).send({
        message: 'OTP expired.',
        success: false,
        data: null,
      });
      return;
    }

    const isMatch = await bcrypt.compare(otp, otpDoc.otp);

    if (!isMatch) {
      res.status(403).send({
        message: 'Invalid OTP.',
        success: false,
        data: null,
      });
      return;
    }

    const { refreshToken, accessToken, userId } = await AuthService.register(
      email,
      password,
      firstName,
      lastName
    );

    await Promise.all([
      AuthService.verifyUserOtp(otpDoc._id),
      AuthService.verifyUser(userId, refreshToken),
    ]);

    res.status(200).send({
      message: 'Register successful.',
      data: {
        refreshToken,
        accessToken,
        user: {
          userId: userId.toString(),
          email,
        },
      },
      success: true,
    });
  } catch (error: any) {
    if (error && error.code === 'E11000') {
      res.status(409).send({
        message: 'Email already in use.',
        success: false,
        data: null,
      });
      return;
    }
    next(error);
  }
}

export async function verifyOtp(
  req: Request<{}, {}, VerifyOtpDto>,
  res: Response<VerifyOtpResponse>,
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
      res.status(410).send({
        message: 'OTP expired.',
        success: false,
        data: null,
      });
      return;
    }

    const isMatch = await bcrypt.compare(otp, otpDoc.otp);

    if (!isMatch) {
      res.status(403).send({
        message: 'Invalid OTP.',
        success: false,
        data: null,
      });
      return;
    }

    const { refreshToken, accessToken } = AuthService.generateTokens(
      user._id.toString(),
      email,
      user.name.first,
      user.name.last
    );

    await Promise.all([
      AuthService.verifyUserOtp(otpDoc._id),
      AuthService.verifyUser(user._id, refreshToken),
    ]);

    res.status(200).send({
      message: 'Email verified successfully.',
      data: {
        refreshToken,
        accessToken,
        user,
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

    res.status(200).send({
      message: `Otp sent to ${email}.`,
      data: null,
      success: true,
    });
  } catch (error: any) {
    if (error.message === 'Blocked For 10 minutes due to multiple failed attempts.') {
      res.status(403).send({
        message: error.message,
        success: false,
        data: null,
      });
      return;
    }
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

    const newAccessToken = AuthService.generateAccessToken(
      user._id.toString(),
      user.email,
      user.name.first,
      user.name.last
    );
    res.status(200).send({
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
