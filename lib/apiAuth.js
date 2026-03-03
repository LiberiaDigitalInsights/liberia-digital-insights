import { NextResponse } from "next/server";
import { verifyToken, extractToken } from "./auth";

/**
 * Higher-order function to protect API routes
 * @param {Function} handler The route handler
 * @param {string[]} roles Allowed roles (admin always has access)
 */
export function withAuth(handler, roles = []) {
  return async (request, context) => {
    try {
      const authHeader = request.headers.get("authorization");
      const token = extractToken(authHeader);

      if (!token) {
        return NextResponse.json(
          { error: "Access denied. No token provided." },
          { status: 401 },
        );
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return NextResponse.json({ error: "Invalid token." }, { status: 401 });
      }

      // RBAC check
      const userRole = decoded.role;

      // Admins have access to everything
      if (userRole !== "admin") {
        if (roles.length > 0 && !roles.includes(userRole)) {
          return NextResponse.json(
            { error: "Forbidden. You do not have the required role." },
            { status: 403 },
          );
        }
      }

      // Attach user to request for use in handler
      // We use a custom property for the decoded payload
      request.user = decoded;

      return handler(request, context);
    } catch (error) {
      console.error("[apiAuth] Auth error:", error);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 500 },
      );
    }
  };
}

/**
 * Optional authentication: attaches user if token is valid, but allows request to proceed if not.
 */
export function optionalAuth(handler) {
  return async (request, context) => {
    try {
      const authHeader = request.headers.get("authorization");
      const token = extractToken(authHeader);

      if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
          request.user = decoded;
        }
      }

      return handler(request, context);
    } catch (error) {
      // On error, still allow public access
      console.warn("[apiAuth] Optional auth encountered error:", error);
      return handler(request, context);
    }
  };
}

/**
 * Helper to authorize admin only
 */
export function withAdmin(handler) {
  return withAuth(handler, ["admin"]);
}
