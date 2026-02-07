"use client";

import { useState, useEffect } from "react";
import { getCookie } from "@/redux/services/apiSlice";
import { UserRole, ProfileResponse } from "@/types/users";
import { useGetProfileQuery } from "@/redux/services/authApi";

export interface UserInfo {
  userId: string | null;
  role: UserRole | null;
  email: string | null;
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
    accessToken: string | null;
    isAuthenticated: boolean;
  }>({
    userId: null,
    role: null,
    email: null,
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

  const hasRole = (role: UserRole) => localState.role === role;
  
  return {
    ...localState,
    profile: profileData?.data || null,
    isLoading: isProfileLoading, 
    hasRole,
  };
}
