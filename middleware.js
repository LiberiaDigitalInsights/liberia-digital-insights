import { NextResponse } from "next/server";

export function middleware(request) {
  const response = NextResponse.next();

  // Security Headers
  // X-Content-Type-Options: Prevents MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // X-Frame-Options: Prevents clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // X-XSS-Protection: Basic XSS filter
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer-Policy: Controls referrer information
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Strict-Transport-Security: Enforces HTTPS
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );

  // Content-Security-Policy: Basic policy
  // Note: For Next.js development, we keep it relatively open to avoid breaking HMR
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; connect-src 'self' https:;",
    );
  }

  return response;
}

// Only run middleware on API routes or specific paths
export const config = {
  matcher: [
    "/api/:path*",
    // Add other paths if needed
  ],
};
