"use client";

import { useState, useEffect } from "react";
import { getCookie } from "@/redux/services/apiSlice";
import { UserRole } from "@/types/users";

export interface UserInfo {
  userId: string | null;
  role: UserRole | null;
  email: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useUser() {
  const [user, setUser] = useState<UserInfo>({
    userId: null,
    role: null,
    email: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const role = getCookie("userRole") as UserRole | null;
    const rawEmail = getCookie("userEmail");
    const email = rawEmail ? decodeURIComponent(rawEmail) : null;
    const accessToken = getCookie("accessToken");
    const userId = getCookie("userId");

    setUser({
      userId: userId || null,
      role: role || null,
      email: email || null,
      accessToken: accessToken || null,
      isAuthenticated: !!accessToken,
      isLoading: false,
    });
  }, []);

  const hasRole = (role: UserRole) => user.role === role;
  
  return {
    ...user,
    hasRole,
  };
}
