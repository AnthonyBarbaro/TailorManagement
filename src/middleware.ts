// middleware.ts (in your project root, not inside app/)
// or place at src/middleware.ts if your Next.js version supports that

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // If the user is accessing /admin, ensure they have the cookie
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    const phoneNumber = request.cookies.get("phoneNumber");
    if (!phoneNumber) {
      // Redirect to /login if no session
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// We only want to run this middleware on /admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
