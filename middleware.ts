import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const access_token = req.cookies.get("token")?.value;

  const authRoute = ["/register", "/log-in"];

  if (access_token && authRoute.includes(nextUrl.pathname)) {
    return Response.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
