import { NextRequest, NextResponse } from "next/server";

const ROLE_PREFIXES: Record<string, string> = {
  "/dashboard": "seeker",
  "/owner": "owner",
  "/admin": "admin",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const matched = Object.keys(ROLE_PREFIXES).find((prefix) => pathname.startsWith(prefix));
  if (!matched) return NextResponse.next();

  const token = request.cookies.get("hohaya_token")?.value;
  const role = request.cookies.get("hohaya_role")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (role !== ROLE_PREFIXES[matched]) {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/owner/:path*", "/admin/:path*"],
};
