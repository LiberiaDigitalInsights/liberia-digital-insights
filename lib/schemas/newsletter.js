import { z } from "zod";
import {
  emailSchema,
  nonEmptyStringSchema,
  optionalStringSchema,
} from "./common";

/**
 * Newsletter validation schemas
 */

// Subscribe schema
export const subscribeSchema = z.object({
  email: emailSchema,
  name: optionalStringSchema,
  company: optionalStringSchema,
  org: optionalStringSchema,
  position: optionalStringSchema,
});

// Unsubscribe schema
export const unsubscribeSchema = z.object({
  token: z.string().min(1, "Unsubscribe token is required"),
});

// Create template schema
export const createTemplateSchema = z.object({
  name: nonEmptyStringSchema.max(
    200,
    "Template name must not exceed 200 characters",
  ),
  subject: nonEmptyStringSchema.max(
    300,
    "Subject must not exceed 300 characters",
  ),
  preview: z
    .string()
    .trim()
    .max(500, "Preview must not exceed 500 characters")
    .optional(),
  content: nonEmptyStringSchema,
  category: z
    .enum(["custom", "weekly", "monthly", "special"])
    .optional()
    .default("custom"),
});
