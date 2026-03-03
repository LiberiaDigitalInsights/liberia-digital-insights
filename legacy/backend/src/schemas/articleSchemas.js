import { z } from "zod";
import {
  nonEmptyStringSchema,
  optionalStringSchema,
  categorySchema,
  urlSchema,
  paginationSchema,
  uuidSchema,
} from "./commonSchemas.js";

/**
 * Article validation schemas
 */

// Create article schema
export const createArticleSchema = z.object({
  title: nonEmptyStringSchema.max(300, "Title must not exceed 300 characters"),
  content: nonEmptyStringSchema,
  excerpt: optionalStringSchema.max(
    500,
    "Excerpt must not exceed 500 characters",
  ),
  category: categorySchema,
  tags: z
    .array(z.string().min(1).max(50))
    .max(10, "Maximum 10 tags allowed")
    .optional(),
  featured_image: urlSchema.optional(),
  author_id: uuidSchema.optional(),
  status: z
    .enum(["draft", "published", "archived"])
    .optional()
    .default("draft"),
  published_at: z.string().datetime().optional(),
});

// Update article schema
export const updateArticleSchema = z.object({
  title: optionalStringSchema.max(300, "Title must not exceed 300 characters"),
  content: optionalStringSchema,
  excerpt: optionalStringSchema.max(
    500,
    "Excerpt must not exceed 500 characters",
  ),
  category: categorySchema.optional(),
  tags: z
    .array(z.string().min(1).max(50))
    .max(10, "Maximum 10 tags allowed")
    .optional(),
  featured_image: urlSchema.optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  published_at: z.string().datetime().optional(),
});

// Query articles schema
export const queryArticlesSchema = paginationSchema.extend({
  category: optionalStringSchema,
  tag: optionalStringSchema,
  status: z.enum(["draft", "published", "archived"]).optional(),
  search: optionalStringSchema,
  author_id: uuidSchema.optional(),
  sort: z
    .enum(["created_at", "published_at", "title", "views"])
    .optional()
    .default("created_at"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Article ID param schema
export const articleIdSchema = z.object({
  id: uuidSchema,
});
