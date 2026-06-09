import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../lib/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import {
  listUsers,
  updateUser,
  getReports,
} from '../controllers/admin.controller.js';

const router = Router();

export const updateUserSchema = z.object({
  role: z.enum(['citizen', 'staff', 'supervisor', 'admin']).optional(),
  is_active: z.boolean().optional(),
}).refine((d) => d.role !== undefined || d.is_active !== undefined, {
  message: 'At least one of role or is_active must be provided',
});

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
});

export const reportsQuerySchema = z.object({
  start: z.string().date(),
  end: z.string().date(),
});

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     summary: Admin — list all users with pagination and search
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/users', authenticate, authorize('admin'), validate(listUsersQuerySchema, 'query'), listUsers);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   patch:
 *     summary: Admin — update user role or active status
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 */
router.patch('/users/:id', authenticate, authorize('admin'), validate(updateUserSchema), updateUser);

/**
 * @openapi
 * /api/admin/reports:
 *   get:
 *     summary: Admin — platform-wide reports for a date range
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/reports', authenticate, authorize('admin'), validate(reportsQuerySchema, 'query'), getReports);

export default router;
