export type Role = 'citizen' | 'staff' | 'supervisor' | 'admin';

export type TicketStatus = 'waiting' | 'active' | 'done' | 'skipped' | 'no_show' | 'cancelled';

export type WindowStatus = 'open' | 'closed';

export type CongestionLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';

// JWT payload shape — Supabase issues the token; we embed role in app_metadata
export interface JwtPayload {
  sub: string;           // Supabase user UUID
  phone?: string;
  app_metadata: {
    role: Role;
  };
  iat: number;
  exp: number;
}

// Attached to req by authenticate middleware
export interface AuthUser {
  id: string;
  role: Role;
  phone?: string;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
