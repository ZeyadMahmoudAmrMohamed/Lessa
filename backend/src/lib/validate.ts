import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { Errors } from './errors.js';

type Target = 'body' | 'query' | 'params';

/**
 * Returns an Express middleware that validates req[target] against the given Zod schema.
 * On success, the parsed (coerced) value replaces the original so controllers get typed data.
 */
export function validate(schema: ZodSchema, target: Target = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      return next(Errors.validation(formatZodError(result.error)));
    }
    // Replace with parsed/coerced value
    (req as Record<string, unknown>)[target] = result.data;
    next();
  };
}

function formatZodError(err: ZodError) {
  return err.errors.map((e) => ({
    field: e.path.join('.'),
    message: e.message,
  }));
}
