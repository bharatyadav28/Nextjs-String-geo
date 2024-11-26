import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// import { jwtDecode } from "jwt-decode";

const restrictedPaths = [
  "/dashboard/watchlist",
  "/auth/billing",
  "/dashboard/account",
];

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  const refreshToken = cookies().get("refreshToken")?.value || "";
  // const isValidToken =
  //   refreshToken && jwtDecode(refreshToken)?.exp < Date.now() / 1000;

  // const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".woff2") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".js")
  ) {
    return NextResponse.next();
  }

  if (!refreshToken && restrictedPaths.includes(pathname)) {
    return NextResponse.redirect(
      new URL(`/auth/signin?from=${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}
