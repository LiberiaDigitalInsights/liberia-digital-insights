import { z } from "zod";
import { emailSchema, passwordSchema } from "./common";

/**
 * Authentication validation schemas
 */

// Register schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must not exceed 100 characters")
    .trim(),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must not exceed 100 characters")
    .trim(),
  role: z
    .enum(["user", "admin", "editor", "moderator", "viewer"])
    .optional()
    .default("user"),
});

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// Password change schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});
