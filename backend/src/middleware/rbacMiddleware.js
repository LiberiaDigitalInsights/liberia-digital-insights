import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: "Invalid token." });
  }
};

export const authorize = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    // Admins have access to everything
    if (req.user.role === "admin") {
      return next();
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden. You do not have the required role." });
    }

    next();
  };
};
