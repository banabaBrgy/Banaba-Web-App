import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const {
    nextUrl: { pathname },
  } = req;
  const access_token = req.cookies.get("token")?.value;
  const protectResidentRoute = pathname.startsWith("/user");
  const protectAdminRoute = pathname.startsWith("/admin");

  if (!access_token && (protectAdminRoute || protectResidentRoute)) {
    return Response.redirect(new URL("/log-in", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
