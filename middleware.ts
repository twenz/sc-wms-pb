// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

interface AuthToken {
  name?: string;
  email?: string;
  role?: string;
}

// Define exact public paths and their prefixes
const PUBLIC_PATHS = {
  exact: ["/", "/login", "/register", "/forgot-password", "/setup"],
  prefixes: ["/api/auth/", "/_next/", "/favicon.ico", "/api/setup", "/api/register",]
};

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check if path matches exactly or starts with allowed prefix
  const isPublicPath = PUBLIC_PATHS.exact.includes(path) ||
    PUBLIC_PATHS.prefixes.some(prefix => path.startsWith(prefix));

  // Allow public paths
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Verify authentication
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  }) as AuthToken | null;

  // Handle unauthenticated requests
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
