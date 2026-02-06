// proxy.ts - Next.js v16 Role-based Access Control Middleware
import { NextRequest, NextResponse } from "next/server";
import { JWTPayload, jwtVerify } from "jose";

// ============================================
// CONFIGURATION
// ============================================

// Public routes (no authentication required)
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
  "/verify-email",
  "/track-parcel",
  "/coverage",
  "/about-us",
  "/terms",
  "/privacy-policy",
];

// Common protected routes (accessible by all authenticated users)
const COMMON_PROTECTED_ROUTES = ["/settings", "/profile", "/notifications"];

// Role-specific routes configuration
const ROLE_ROUTES = {
  SUPER_ADMIN: ["/super-admin"],
  SELLER: ["/seller-admin"],
  CUSTOMER: ["/track-parcel", "/profile"],
};

// Default redirect paths for each role after login
const ROLE_DEFAULT_PATHS = {
  SUPER_ADMIN: "/super-admin/dashboard",
  SELLER: "/seller-admin/dashboard",
  CUSTOMER: "/track-parcel",
};

// JWT Secret - Use environment variable in production
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

// ============================================
// HELPER FUNCTIONS
// ============================================

async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    if (pathname === route) return true;
    if (pathname.startsWith(route + "/")) return true;
    return false;
  });
}

function hasRoleAccess(pathname: string, userRole: string): boolean {
  if (matchesRoute(pathname, COMMON_PROTECTED_ROUTES)) {
    return true;
  }

  const roleRoutes = ROLE_ROUTES[userRole as keyof typeof ROLE_ROUTES] || [];
  return matchesRoute(pathname, roleRoutes);
}

function getRoleDefaultPath(userRole: string): string {
  return (
    ROLE_DEFAULT_PATHS[userRole as keyof typeof ROLE_DEFAULT_PATHS] ||
    "/track-parcel"
  );
}

function isProtectedRoute(pathname: string): boolean {
  if (matchesRoute(pathname, PUBLIC_ROUTES)) {
    return false;
  }
  return true;
}

// ============================================
// MAIN PROXY FUNCTION
// ============================================

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip for static files and APIs
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  const isAuthenticated = !!accessToken;

  // 1. Redirect authenticated users away from auth pages
  if (isAuthenticated && (pathname === "/login" || pathname === "/signup" || pathname === "/verify-email")) {
    const defaultPath = getRoleDefaultPath(userRole || "CUSTOMER");
    return NextResponse.redirect(new URL(defaultPath, request.url));
  }

  // 2. Protect routes
  const requiresAuth = isProtectedRoute(pathname);
  if (requiresAuth) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole && !hasRoleAccess(pathname, userRole)) {
      const defaultPath = getRoleDefaultPath(userRole);
      return NextResponse.redirect(new URL(defaultPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};