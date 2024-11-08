export interface RegisterDto {
  email: string;
}
export interface CompleteRegisterationDto {
  email: string;
  otp: string;
  password: string;
}
export interface RequestEmailOTPDto {
  email: string;
}

export interface VerifyEmailDto {
  email: string;
  otp: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
export interface RefreshTokenDto {
  refreshToken: string;
}

export interface LogoutDto {
  refreshToken: string;
}
