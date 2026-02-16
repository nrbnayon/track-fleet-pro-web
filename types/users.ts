// types/users.ts
export type UserRole = "SUPER_ADMIN" | "SELLER" | "CUSTOMER" | "DRIVER";

export interface User {
  user_id: string;
  full_name: string;
  email_address: string;
  role: UserRole;
  business_name?: string;
  account_type?: "business" | "personal";
  profile_image?: string | null;
  address?: string;
  is_verified?: boolean;
  
  seller_profile?: {
    full_name_seller?: string;
    address: string;
    phone_number: string;
    profile_image: string | null;
  };

  driver_profile?: {
    first_name: string;
    last_name: string;
    vehicle_number: string;
    address: string;
    phone_number: string;
    profile_image: string | null;
  };

  customer_profile?: {
    default_delivery_address: string;
    phone_number: string;
    profile_image: string | null;
  };
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  access_token_valid_till?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  errors?: any;
  error_code?: string;
}

// Auth Request/Response Types
export interface SignupRequest {
  full_name: string;
  email_address: string;
  password: string;
  business_name?: string;
  account_type: "business" | "personal";
  role: "SELLER" | "CUSTOMER";
}

export interface SignupResponse {
  user_id: string;
  role: UserRole;
}

export interface LoginRequest {
  email_address: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user_id: string;
  role: UserRole;
}

export interface VerifyEmailRequest {
  user_id: string;
  code: string;
}

export interface VerifyEmailResponse {
  access_token: string;
  access_token_valid_till: number;
  refresh_token: string;
  user_id: string;
  role: UserRole;
}

export interface ForgotPasswordRequest {
  email_address: string;
}

export interface ForgotPasswordResponse {
  user_id: string;
  expires_at: number;
}

export interface VerifyResetCodeRequest {
  user_id: string;
  code: string;
}

export interface VerifyResetCodeResponse {
  user_id: string;
  secret_key: string;
}

export interface ResetPasswordRequest {
  user_id: string;
  secret_key: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ResendOtpRequest {
  email_address: string;
}

export interface ResendOtpResponse {
  email_address: string;
  expires_at: number;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export interface ProfileResponse {
  id: number;
  full_name: string;
  email_address: string;
  profile_image?: string | null;
  address?: string;
  role: UserRole;
  is_verified: boolean;
  seller_profile?: {
    address: string;
    phone_number: string;
    profile_image: string | null;
  };
  driver_profile?: {
    first_name: string;
    last_name: string;
    vehicle_number: string;
    address: string;
    phone_number: string;
    profile_image: string | null;
  };
  customer_profile?: {
    default_delivery_address: string;
    phone_number: string;
    profile_image: string | null;
  };
}

