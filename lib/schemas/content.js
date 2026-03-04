import { z } from "zod";
import { paginationSchema } from "./common";

/**
 * Content related validation schemas
 */

// Article query schema
export const articleQuerySchema = paginationSchema.extend({
  category: z.string().optional(),
  status: z.string().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  featured: z
    .string()
    .optional()
    .transform((val) => val === "true"),
});

// Article submission schema
export const articleSubmissionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z.string().max(1000).optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  cover_image_url: z
    .string()
    .url("Invalid cover image URL")
    .optional()
    .or(z.literal("")),
  category_id: z.string().uuid("Invalid category ID"),
  author_id: z.string().uuid("Invalid author ID").optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  tags: z.array(z.string()).optional(),
  published_at: z
    .string()
    .datetime()
    .optional()
    .or(z.literal(""))
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)),
});

// Event query schema
export const eventQuerySchema = paginationSchema.extend({
  category: z.string().optional(),
  status: z.string().optional(),
  upcoming: z
    .string()
    .optional()
    .transform((val) => val === "true"),
});

// Event submission schema
export const eventSubmissionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z.string().max(1000).optional(),
  content: z.string().optional(),
  cover_image_url: z
    .string()
    .url("Invalid cover image URL")
    .optional()
    .or(z.literal("")),
  date: z.string().datetime("Invalid date format"),
  location: z.string().min(2, "Location is required"),
  type: z
    .enum(["webinar", "workshop", "conference", "meetup"])
    .default("webinar"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  link: z.string().url("Invalid link URL").optional().or(z.literal("")),
});

// Insight query schema
export const insightQuerySchema = paginationSchema.extend({
  category: z.string().optional(),
  status: z.string().optional(),
});

// Insight submission schema
export const insightSubmissionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z.string().max(1000).optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  cover_image_url: z
    .string()
    .url("Invalid cover image URL")
    .optional()
    .or(z.literal("")),
  category_id: z.string().uuid("Invalid category ID"),
  author_id: z.string().uuid("Invalid author ID").optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  tags: z.array(z.string()).optional(),
  published_at: z
    .string()
    .datetime()
    .optional()
    .or(z.literal(""))
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)),
});

// Talent query schema
export const talentQuerySchema = paginationSchema.extend({
  category: z.string().optional(),
  status: z.string().optional(),
});

// Talent submission schema
export const talentSubmissionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  role: z.string().min(2, "Role must be at least 2 characters").max(100),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(2000),
  category: z.string().min(2, "Category is required"),
  avatar_url: z.string().url("Invalid avatar URL").optional().or(z.literal("")),
  links: z.record(z.string()).optional(),
  status: z.enum(["pending", "published", "draft"]).default("pending"),
  skills: z.array(z.string()).optional(),
  experience: z.string().optional(),
  location: z.string().optional(),
  availability: z.string().optional(),
});

// Newsletter subscription schema
export const subscriptionSchema = z.object({
  email: z.string().email("Invalid email format"),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  interests: z.array(z.string()).optional(),
});
