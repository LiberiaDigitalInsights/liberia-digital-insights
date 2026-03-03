import { z } from "zod";
import {
  emailSchema,
  nonEmptyStringSchema,
  optionalStringSchema,
} from "./commonSchemas.js";

/**
 * Newsletter validation schemas
 */

// Subscribe schema
export const subscribeSchema = z.object({
  email: emailSchema,
  first_name: optionalStringSchema,
  last_name: optionalStringSchema,
  preferences: z
    .object({
      frequency: z.enum(["daily", "weekly", "monthly"]).optional(),
      categories: z.array(z.string()).optional(),
    })
    .optional(),
});

// Unsubscribe schema
export const unsubscribeSchema = z.object({
  email: emailSchema,
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

// Update template schema
export const updateTemplateSchema = z.object({
  name: z
    .string()
    .trim()
    .max(200, "Template name must not exceed 200 characters")
    .optional(),
  subject: z
    .string()
    .trim()
    .max(300, "Subject must not exceed 300 characters")
    .optional(),
  preview: z
    .string()
    .trim()
    .max(500, "Preview must not exceed 500 characters")
    .optional(),
  content: optionalStringSchema,
  category: z.enum(["custom", "weekly", "monthly", "special"]).optional(),
});

// Send newsletter schema
export const sendNewsletterSchema = z.object({
  template_id: z.string().uuid("Invalid template ID"),
  subject: z
    .string()
    .trim()
    .max(300, "Subject must not exceed 300 characters")
    .optional(),
  segment: z
    .enum(["all", "active", "inactive", "custom"])
    .optional()
    .default("all"),
  custom_emails: z.array(emailSchema).optional(),
});
