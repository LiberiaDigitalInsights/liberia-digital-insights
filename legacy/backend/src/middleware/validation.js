import { ZodError } from "zod";

/**
 * Validation middleware factory
 * Creates middleware that validates request data against Zod schemas
 */

/**
 * Validate request body
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {import('express').RequestHandler}
 */
export const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};

/**
 * Validate request query parameters
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {import('express').RequestHandler}
 */
export const validateQuery = (schema) => {
  return async (req, res, next) => {
    try {
      req.query = await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Invalid query parameters",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};

/**
 * Validate request params
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {import('express').RequestHandler}
 */
export const validateParams = (schema) => {
  return async (req, res, next) => {
    try {
      req.params = await schema.parseAsync(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Invalid URL parameters",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};
