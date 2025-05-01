// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Define public paths that don't require authentication
  const publicApi = ['/api/users']
  const publicPaths = ["/", "/login", "/register", "/forgot-password", "/setup", ...publicApi];
  const isPublicPath = publicPaths.includes(path) && !path.startsWith("/api/restricted")

  // Check if the path is for API routes or public assets
  // const isApiPath = path.startsWith("/api") && !path.startsWith("/api/restricted");
  const isStaticPath = path.startsWith("/_next") || path.includes(".");

  if (isPublicPath || isStaticPath) {
    // console.log("Public path or API route, no authentication required:", path, isPublicPath);
    return NextResponse.next();
  }

  // Get the token and check if the user is authenticated
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  // console.log("🚀 ~ middleware ~ token:", token)

  // Redirect to login if no token and accessing protected route
  if (!token) {
    const url = new URL("/login", req.url);

    // url.searchParams.set("callbackUrl", encodeURI(req.url));
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    // console.log("Redirecting to login:", url.toString());
    return NextResponse.redirect(url);
  }

  // Check role-based permissions (add your own logic as needed)
  // if (path.startsWith("/dashboard/admin") && token.role !== "admin") {
  //   return NextResponse.redirect(new URL("/dashboard", req.url));
  // }
  // console.log("Token found:", token);
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
