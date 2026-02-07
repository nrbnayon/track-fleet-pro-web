"use client";

import { useState, useEffect } from "react";
import { getCookie } from "@/redux/services/apiSlice";
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
  const [localState, setLocalState] = useState<{
    userId: string | null;
    role: UserRole | null;
    email: string | null;
    fullName?: string | null;
    profileImage?: string | null;
    isVerified?: boolean | null;
    accessToken: string | null;
    isAuthenticated: boolean;
  }>({
    userId: null,
    role: null,
    email: null,
    fullName: null,
    profileImage: null,
    isVerified: null,
    accessToken: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const role = getCookie("userRole") as UserRole | null;
    const rawEmail = getCookie("userEmail");
    const email = rawEmail ? decodeURIComponent(rawEmail) : null;
    const accessToken = getCookie("accessToken");
    const userId = getCookie("userId");

    setLocalState({
      userId: userId || null,
      role: role || null,
      email: email || null,
      accessToken: accessToken || null,
      isAuthenticated: !!accessToken,
    });
  }, []);

  // Fetch profile if authenticated
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery(undefined, {
    skip: !localState.isAuthenticated,
  });

  // console.log("Profile Data in hook: ", profileData);

  const hasRole = (role: UserRole) => localState.role === role;
  
  const userProfile = profileData?.data || null;

  // console.log("Profile Data in hook userProfile: ", userProfile);


  return {
    ...localState,
    fullName: userProfile?.full_name || localState.fullName,
    email: userProfile?.email_address || localState.email,
    profileImage: userProfile?.profile_image || localState.profileImage,
    profile: userProfile,
    isLoading: isProfileLoading, 
    hasRole,
  };
}
