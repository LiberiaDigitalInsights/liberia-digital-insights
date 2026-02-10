import { z } from "zod";
import { emailSchema, passwordSchema } from "./commonSchemas.js";

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
  role: z.enum(["user", "admin", "editor"]).optional().default("user"),
});

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// Password reset request schema
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

// Password reset schema
export const passwordResetSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: passwordSchema,
});

// Update profile schema
export const updateProfileSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must not exceed 100 characters")
    .trim()
    .optional(),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must not exceed 100 characters")
    .trim()
    .optional(),
  bio: z
    .string()
    .max(500, "Bio must not exceed 500 characters")
    .trim()
    .optional(),
});
