import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const cookies = req.cookies;
  const token = cookies.get("session_id");

  const protectedRoutes = ["/administration", "/administration/*"];

  const url = req.nextUrl.clone();

  if (
    protectedRoutes.some((route) => url.pathname.startsWith(route)) &&
    !token
  ) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
