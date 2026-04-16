import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Higher-order middleware to validate requests against a Zod schema.
 * Supports validating 'body', 'query', and 'params'.
 */
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: error.errors.map((err) => ({
            field: err.path.join('.').replace('body.', '').replace('query.', '').replace('params.', ''),
            message: err.message,
          })),
        });
      }
      return res.status(500).json({ message: 'Internal server error during validation' });
    }
  };
};
