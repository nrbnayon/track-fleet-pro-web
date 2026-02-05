// lib/redux/services/authApi.ts
import { apiSlice } from './apiSlice';

interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  user: {
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

interface SignupRequest {
  accountType: 'business' | 'personal';
  full_name: string;
  business_name?: string;
  email: string;
  password: string;
}

interface SignupResponse {
  message: string;
  email: string;
}

interface VerifyOtpRequest {
  email: string;
  otp: string;
}

interface VerifyOtpResponse {
  message: string;
  verified: boolean;
}

// Inject endpoints into the API slice
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    
    // Signup endpoint
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    
    // Verify OTP endpoint
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (otpData) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: otpData,
      }),
    }),
    
    // Logout endpoint
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    
    // Get current user
    getCurrentUser: builder.query<LoginResponse['user'], void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useLoginMutation,
  useSignupMutation,
  useVerifyOtpMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} = authApi;
