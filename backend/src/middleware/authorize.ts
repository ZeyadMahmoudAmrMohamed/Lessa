import { Request, Response, NextFunction } from 'express';
import { Role } from '../lib/types.js';
import { Errors } from '../lib/errors.js';

/**
 * Middleware factory: requires req.user.role to be one of the allowed roles.
 * Must be chained after authenticate().
 *
 * Usage: router.get('/path', authenticate, authorize('admin', 'supervisor'), handler)
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(Errors.unauthorized());
    }
    if (!allowedRoles.includes(req.user.role)) {
      // Log attempt for audit — intentionally minimal for MVP
      console.warn(
        `[RBAC] 403 — user=${req.user.id} role=${req.user.role} attempted ${req.method} ${req.path}`,
      );
      return next(Errors.forbidden());
    }
    next();
  };
}
