"use client";

import { useAppSelector } from "@/redux/hooks";
import { UserRole, ProfileResponse } from "@/types/users";
import { useGetProfileQuery } from "@/redux/services/authApi";

export interface UserInfo {
  userId: string | null;
  role: UserRole | null;
  email: string | null;
  fullName?: string | null;
  profileImage?: string | null;
  isVerified?: boolean | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: ProfileResponse | null;
}

export function useUser() {
  const { 
    user, 
    token: accessToken, 
    isAuthenticated 
  } = useAppSelector((state) => state.auth);

  // Fetch profile if authenticated
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const userProfile = profileData?.data || null;

  const hasRole = (role: UserRole) => user?.role === role;
  
  return {
    userId: user?.user_id || null,
    role: user?.role || null,
    email: user?.email_address || null,
    accessToken,
    isAuthenticated,
    fullName: userProfile?.full_name || user?.full_name || null,
    profileImage: userProfile?.profile_image || user?.profile_image || null,
    profile: userProfile,
    isLoading: isProfileLoading, 
    hasRole,
  };
}
