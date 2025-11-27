import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  const protectedGroups = [
    "/admin",
    "/business",
    "/category",
    "/customer",
    "/delivery",
    "/pickdash",
  ];

  const isProtected = protectedGroups.some((p) =>
    pathname.startsWith(p)
  );

  // Si requiere auth y no hay token → login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth?mode=login", req.url));
  }

  // Si hay token, cargamos roles
  let roles: string[] = [];

  if (token) {
    const rolesRes = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/role`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (rolesRes.ok) {
      const data = await rolesRes.json();
      roles = data.roles.map((r: any) => r.name);
    }
  }

  // ===============================
  // 💼 REGLAS POR RUTA
  // ===============================

  // ADMIN (admin y category)
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/category")
  ) {
    if (!roles.includes("ADMIN")) {
      return NextResponse.rewrite(new URL("/404", req.url));
    }
  }

  // BUSINESS (OWNER, MANAGER)
  if (pathname.startsWith("/business")) {
    if (
      !roles.includes("OWNER") &&
      !roles.includes("MANAGER") &&
      !roles.includes("ADMIN")
    ) {
      return NextResponse.rewrite(new URL("/404", req.url));
    }
  }

  // CUSTOMER (CONSUMER)
  if (pathname.startsWith("/customer")) {
    if (!roles.includes("CONSUMER") && !roles.includes("ADMIN")) {
      return NextResponse.rewrite(new URL("/404", req.url));
    }
  }

  // DELIVERY (DELIVERY)
  if (pathname.startsWith("/delivery")) {
    if (!roles.includes("DELIVERY") && !roles.includes("ADMIN")) {
      return NextResponse.rewrite(new URL("/404", req.url));
    }
  }

  // Pickdash — cualquier usuario con sesión
  if (pathname.startsWith("/pickdash")) {
    if (roles.length === 0) {
      return NextResponse.redirect(new URL("/auth?mode=login", req.url));
    }
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
