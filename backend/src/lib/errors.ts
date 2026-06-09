export type AppErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNPROCESSABLE'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message: string,
    public readonly statusCode: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const Errors = {
  unauthorized: (msg = 'Authentication required') =>
    new AppError('UNAUTHORIZED', msg, 401),

  forbidden: (msg = 'Insufficient permissions') =>
    new AppError('FORBIDDEN', msg, 403),

  notFound: (resource: string) =>
    new AppError('NOT_FOUND', `${resource} not found`, 404),

  conflict: (msg: string) =>
    new AppError('CONFLICT', msg, 409),

  unprocessable: (msg: string) =>
    new AppError('UNPROCESSABLE', msg, 422),

  validation: (details: unknown) =>
    new AppError('VALIDATION_ERROR', 'Validation failed', 400, details),

  internal: (msg = 'Internal server error') =>
    new AppError('INTERNAL_ERROR', msg, 500),
};
