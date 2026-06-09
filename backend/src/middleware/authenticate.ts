import { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { env } from '../lib/env.js';
import { Errors } from '../lib/errors.js';

const JWKS = createRemoteJWKSet(
  new URL(`${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`)
);

/**
 * Validates the Bearer JWT in Authorization header using Supabase's JWKS (ES256).
 * Attaches req.user = { id, role, phone } on success.
 * Calls next() with 401 AppError on failure.
 */
export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(Errors.unauthorized());
  }

  const token = header.slice(7);
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `${env.SUPABASE_URL}/auth/v1`,
    });

    const role = (payload.app_metadata as any)?.role;
    if (!role) {
      return next(Errors.unauthorized('Token missing role claim'));
    }

    req.user = {
      id: payload.sub!,
      role,
      phone: (payload as any).phone,
    };

    next();
  } catch {
    next(Errors.unauthorized('Invalid or expired token'));
  }
}
