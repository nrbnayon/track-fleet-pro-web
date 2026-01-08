// app/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  // Get user role from cookies
  const cookieStore = await cookies();
  const userRole = cookieStore.get("userRole")?.value;
  const accessToken = cookieStore.get("accessToken")?.value;

  // If user is authenticated, redirect to their dashboard
  if (accessToken && userRole) {
    switch (userRole) {
      case "superadmin":
        redirect("/super-admin/dashboard");
      case "selleradmin":
        redirect("/seller-admin/dashboard");
      case "customer":
        redirect("/track-parcel");
      case "admin":
        redirect("/admin/dashboard");
      case "user":
        redirect("/user/dashboard");
      default:
        redirect("/login");
    }
  }

  // If not authenticated, redirect to public landing page
  redirect("/track-parcel");
}