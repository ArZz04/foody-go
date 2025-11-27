import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  // Si no hay token → mandar al login
  if (!token) {
    return NextResponse.redirect(
      new URL("/auth?mode=login", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/business/:path*",
    "/category/:path*",
    "/customer/:path*",
    "/delivery/:path*",
    "/pickdash/:path*",
  ],
};
