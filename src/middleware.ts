import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Guards the dashboard and admin API.
 *  - /dashboard/*  → redirect to /login when not signed in
 *  - /api/admin/*  → 401 JSON when not signed in
 *  - /login        → redirect to /dashboard when already signed in
 * (Every admin route and the dashboard layout re-check the session too.)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname.startsWith("/api/admin")) {
    if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === "/login" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/api/admin/:path*"],
};
