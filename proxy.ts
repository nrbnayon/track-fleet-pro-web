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
  "/verify-email",
  "/terms",
  "/privacy-policy",
  "/track-parcel",
  "/coverage",
  "/about-us",
];

// Common protected routes (accessible by all authenticated users)
const COMMON_PROTECTED_ROUTES = ["/track-parcel", "/coverage", "/about-us", "/terms", "/privacy-policy", "/settings", "/profile","/", "notifications"];

// Role-specific routes configuration
const ROLE_ROUTES = {
  superadmin: ["/super-admin/dashboard", "/super-admin/parcels", "/super-admin/drivers", "/super-admin/sellers", "/super-admin/analysis"],
  selleradmin: ["/seller-admin/dashboard", "/seller-admin/parcels", "/seller-admin/analysis"],
  customer: ["/track-parcel", "/profile", "/settings", "/"],

  // Add more roles as needed
};

// Routes that multiple roles can access (shared access)
const SHARED_ROUTES = {
  "/settings": ["superadmin", "selleradmin", "customer"], // All roles can access
  "/profile": ["superadmin", "selleradmin", "customer"], // All roles can access
};

// Default redirect paths for each role after login
const ROLE_DEFAULT_PATHS = {
  superadmin: "/super-admin/dashboard",
  selleradmin: "/seller-admin/dashboard",
  customer: "/track-parcel",
};

// JWT Secret - Use environment variable in production
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Verify JWT token
 */
async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("❌ Error verifying token:", error);
    return null;
  }
}

/**
 * Check if a path matches any route in the list
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    // Exact match
    if (pathname === route) return true;
    // Prefix match (e.g., /dashboard matches /dashboard/*)
    if (pathname.startsWith(route + "/")) return true;
    return false;
  });
}

/**
 * Check if a user role has access to a specific path
 */
function hasRoleAccess(pathname: string, userRole: string): boolean {
  // Check if it's a common protected route (accessible by all authenticated users)
  if (matchesRoute(pathname, COMMON_PROTECTED_ROUTES)) {
    return true;
  }

  // Check if it's a shared route
  for (const [route, allowedRoles] of Object.entries(SHARED_ROUTES)) {
    if (pathname === route || pathname.startsWith(route + "/")) {
      return allowedRoles.includes(userRole);
    }
  }

  // Check role-specific routes
  const roleRoutes = ROLE_ROUTES[userRole as keyof typeof ROLE_ROUTES] || [];
  return matchesRoute(pathname, roleRoutes);
}

/**
 * Get the appropriate redirect path for a role
 */
function getRoleDefaultPath(userRole: string): string {
  return (
    ROLE_DEFAULT_PATHS[userRole as keyof typeof ROLE_DEFAULT_PATHS] ||
    "/"
  );
}

/**
 * Check if the route requires authentication
 */
function isProtectedRoute(pathname: string): boolean {
  // Check if it's a public route
  if (matchesRoute(pathname, PUBLIC_ROUTES)) {
    return false;
  }

  // Check if it's a common protected route
  if (matchesRoute(pathname, COMMON_PROTECTED_ROUTES)) {
    return true;
  }

  // Check if it's in any role-specific routes
  for (const routes of Object.values(ROLE_ROUTES)) {
    if (matchesRoute(pathname, routes)) {
      return true;
    }
  }

  // Check if it's a shared route
  for (const route of Object.keys(SHARED_ROUTES)) {
    if (pathname === route || pathname.startsWith(route + "/")) {
      return true;
    }
  }

  return false;
}

// ============================================
// MAIN PROXY FUNCTION (Next.js v16)
// ============================================

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  console.log("🔐 Middleware:", pathname);

  // ============================================
  // STEP 1: Extract tokens from cookies
  // ============================================
  const accessToken = request.cookies.get("accessToken")?.value;
  let userRole = request.cookies.get("userRole")?.value;

  // ============================================
  // STEP 2: Verify access token
  // ============================================
  let user = null;
  let isAuthenticated = false;
  const isDevelopment = process.env.NODE_ENV !== "production";

  if (accessToken) {
    // Development mode: Accept dummy credentials
    // Check for dummy credentials (allow in all environments for demo/design phase)
    if (accessToken === "dev-superadmin-token") {
      user = { email: "superadmin@gmail.com", role: "superadmin" };
      isAuthenticated = true;
      if (!userRole) {
        userRole = "superadmin";
      }
    } else if (accessToken === "dev-selleradmin-token") {
      user = { email: "selleradmin@gmail.com", role: "selleradmin" };
      isAuthenticated = true;
      if (!userRole) {
        userRole = "selleradmin";
      }
    } else if (accessToken === "dev-customer-token") {
      user = { email: "customer@gmail.com", role: "customer" };
      isAuthenticated = true;
      if (!userRole) {
        userRole = "customer";
      }
    } else {
      // Production mode: Verify JWT token
      user = await verifyToken(accessToken);
      isAuthenticated = !!user;

      // Extract role from token payload (if not in cookie)
      if (user && !userRole) {
        userRole = (user.role as string) || (user.userRole as string);
      }
    }
  }

  console.log("✅ Auth Status:", { isAuthenticated, userRole, user });

  // ============================================
  // STEP 3: Public routes handling
  // ============================================
  const isPublicRoute = matchesRoute(pathname, PUBLIC_ROUTES);

  if (isPublicRoute) {
    // If authenticated user visits login/signup, redirect to their role's default page
    if (
      isAuthenticated &&
      (pathname === "/login" || pathname === "/signup")
    ) {
      const defaultPath = getRoleDefaultPath(userRole || "customer");
      return NextResponse.redirect(new URL(defaultPath, request.url));
    }

    const response = NextResponse.next();
    // Add security headers
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return response;
  }

  // ============================================
  // STEP 4: Protected routes handling
  // ============================================
  const requiresAuth = isProtectedRoute(pathname);

  if (requiresAuth) {
    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      console.log("❌ Unauthorized - Redirecting to login");
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has role-based access
    if (!hasRoleAccess(pathname, userRole || "")) {
      console.log("❌ Forbidden - User role does not have access");
      const defaultPath = getRoleDefaultPath(userRole || "customer");
      return NextResponse.redirect(new URL(defaultPath, request.url));
    }

    // Authenticated and authorized - allow access
    console.log("✅ Authorized - Access granted");
    const response = NextResponse.next();
    // Add security headers
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return response;
  }

  // Default: Allow all other routes with security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};