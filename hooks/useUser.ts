"use client";

import { useState, useEffect } from "react";

export interface UserInfo {
  role: string | null;
  email: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useUser() {
  const [user, setUser] = useState<UserInfo>({
    role: null,
    email: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const getCookie = (name: string) => {
      if (typeof document === "undefined") return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
      return null;
    };

    const role = getCookie("userRole");
    const rawEmail = getCookie("userEmail");
    const email = rawEmail ? decodeURIComponent(rawEmail) : null;
    const accessToken = getCookie("accessToken");

    setUser({
      role: role || null,
      email: email || null,
      accessToken: accessToken || null,
      isAuthenticated: !!accessToken,
      isLoading: false,
    });
  }, []);

  const hasRole = (role: string) => user.role === role;
  
  return {
    ...user,
    hasRole,
  };
}
