import { IUser } from '../models/User';
import { BaseResponse } from './response';

export interface AuthDataResponse extends BaseResponse {
  data: null;
}
export interface GetUserResponse extends BaseResponse {
  data: IUser | null;
}
export interface CompleteRegisterationSchema extends BaseResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      email: string;
      userId: string;
    };
  } | null;
}

export interface RefreshTokenResponse extends BaseResponse {
  data: {
    accessToken: string;
  } | null;
}

export interface LogOutResponse extends BaseResponse {
  data: {
    apiKey: string;
  } | null;
}

export interface VerifyOtpResponse extends BaseResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: IUser;
  } | null;
}
