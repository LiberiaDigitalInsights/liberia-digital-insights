import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Security Headers
  // X-Content-Type-Options: Prevents MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // X-Frame-Options: Improved for Vercel Live and internal framing
  response.headers.set("X-Frame-Options", "SAMEORIGIN");

  // X-XSS-Protection: Basic XSS filter
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer-Policy: Controls referrer information
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Strict-Transport-Security: Enforces HTTPS
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );

  // Content-Security-Policy: Relaxed for Vercel Live and external assets
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://*.fbcdn.net https://*.fbcdn.com https://images.unsplash.com https://*.unsplash.com https:; font-src 'self' data:; connect-src 'self' https: https://vercel.live; frame-src 'self' https://vercel.live; frame-ancestors 'self' https://*.vercel.app;",
    );
  }

  // 2. RBAC / Auth Checks (Placeholders)
  // For document requests to /admin, we could check for an auth cookie here
  // if (!request.cookies.has('auth-token') && pathname.startsWith('/admin')) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/login';
  //   url.searchParams.set('redirect', pathname);
  //   return NextResponse.redirect(url);
  // }

  return response;
}

// Ensure middleware runs on relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
