import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { logout as logoutAction } from "@/redux/features/authSlice";
import { apiSlice } from "@/redux/services/apiSlice";

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const logout = () => {
    // 1. Dispatch logout action to clear Redux state
    dispatch(logoutAction());

    // 2. Clear RTK Query cache
    dispatch(apiSlice.util.resetApiState());

    // 3. Clear cookies
    const authCookies = [
      "accessToken",
      "refreshToken",
      "userRole",
      "userEmail",
      "userId",
    ];

    authCookies.forEach((cookieName) => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;`;
    });

    // 4. Redirect to login
    // Using window.location.href for a hard redirect to ensure all states are clean
    // or router.replace if we want to stay in SPA mode but force navigation
    router.replace("/login");
    
    // Optional: hard reload if issues persist
    // window.location.href = "/login";
  };

  return { logout };
};
