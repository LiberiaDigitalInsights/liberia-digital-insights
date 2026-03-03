import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * Verify a JWT token
 * @param {string} token
 * @returns {object|null} Decoded token or null if invalid
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Sign a new JWT token
 * @param {object} payload
 * @param {string} expiresIn
 * @returns {string} Signed token
 */
export const signToken = (payload, expiresIn = "24h") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader
 * @returns {string|null} Token or null
 */
export const extractToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};
