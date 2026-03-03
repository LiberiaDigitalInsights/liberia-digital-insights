import { z } from "zod";

/**
 * Common validation schemas used across multiple routes
 */

// Email validation
export const emailSchema = z
  .string()
  .email("Invalid email format")
  .min(5, "Email must be at least 5 characters")
  .max(255, "Email must not exceed 255 characters")
  .toLowerCase()
  .trim();

// Password validation - minimum 8 characters with complexity requirements
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must not exceed 128 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  );

// UUID validation
export const uuidSchema = z.string().uuid("Invalid UUID format");

// Pagination schemas
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().min(1, "Page must be at least 1")),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(z.number().int().min(1).max(100, "Limit must be between 1 and 100")),
});

// Category validation
export const categorySchema = z
  .string()
  .min(2, "Category must be at least 2 characters")
  .max(50, "Category must not exceed 50 characters")
  .trim();

// URL validation
export const urlSchema = z
  .string()
  .url("Invalid URL format")
  .max(2048, "URL must not exceed 2048 characters");

// Date validation
export const dateSchema = z
  .string()
  .datetime("Invalid date format")
  .or(z.date());

// Non-empty string validation
export const nonEmptyStringSchema = z
  .string()
  .min(1, "Field cannot be empty")
  .trim();

// Optional string validation
export const optionalStringSchema = z.string().trim().optional();
