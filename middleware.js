import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname, search } = req.nextUrl;

  const isUserProtected =
    pathname === "/cart" ||
    pathname.startsWith("/cart/") ||
    pathname === "/profile" ||
    pathname.startsWith("/profile/") ||
    pathname === "/orders" ||
    pathname.startsWith("/orders/");

  const isAdminProtected = pathname === "/admin" || pathname.startsWith("/admin/");

  if (!isUserProtected && !isAdminProtected) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminProtected && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cart/:path*", "/profile/:path*", "/orders/:path*"],
};
