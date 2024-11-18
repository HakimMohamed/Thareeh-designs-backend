import { BaseResponse } from './response';

export interface AuthDataResponse extends BaseResponse {
  data: null;
}
export interface CompleteRegisterationSchema extends BaseResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  } | null;
}
export interface RequestEmailOTPResponse extends BaseResponse {
  data: null;
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

export interface VerifyEmailResponse extends BaseResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  } | null;
}
