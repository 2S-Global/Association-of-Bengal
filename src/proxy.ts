import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin/admin-session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await verifyAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);

  if (pathname === "/admin") {
    return NextResponse.redirect(new URL(session ? "/admin/dashboard" : "/admin/login", request.url));
  }

  if (pathname === "/admin/login") {
    return session
      ? NextResponse.redirect(new URL("/admin/dashboard", request.url))
      : NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
