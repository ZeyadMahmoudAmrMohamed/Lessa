import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../lib/env.js';
import { Errors } from '../lib/errors.js';
import { JwtPayload } from '../lib/types.js';

/**
 * Validates the Bearer JWT in Authorization header.
 * Attaches req.user = { id, role, phone } on success.
 * Calls next() with 401 AppError on failure.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(Errors.unauthorized());
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.SUPABASE_JWT_SECRET) as JwtPayload;

    const role = payload.app_metadata?.role;
    if (!role) {
      return next(Errors.unauthorized('Token missing role claim'));
    }

    req.user = {
      id: payload.sub,
      role,
      phone: payload.phone,
    };

    next();
  } catch {
    next(Errors.unauthorized('Invalid or expired token'));
  }
}
