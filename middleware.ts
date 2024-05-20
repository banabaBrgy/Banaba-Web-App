import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const access_token = req.cookies.get("token")?.value;

  const securedRoute = ["/resident", "/admin"];

  if (!access_token && securedRoute.includes(nextUrl.pathname)) {
    return Response.redirect(new URL("/log-in", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
