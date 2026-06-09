import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../lib/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import {
  getBranchDashboard,
  updateWindow,
  assignStaff,
  getDailySummary,
} from '../controllers/supervisor.controller.js';

const router = Router();

export const updateWindowSchema = z.object({
  status: z.enum(['open', 'closed']).optional(),
});

export const assignStaffSchema = z.object({
  staff_id: z.string().uuid(),
});

/**
 * @openapi
 * /api/supervisor/branch/dashboard:
 *   get:
 *     summary: Supervisor — live branch overview (all windows + summary stats)
 *     tags: [Supervisor]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/branch/dashboard', authenticate, authorize('supervisor', 'admin'), getBranchDashboard);

/**
 * @openapi
 * /api/supervisor/branch/summary:
 *   get:
 *     summary: Supervisor — daily ticket summary
 *     tags: [Supervisor]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/branch/summary', authenticate, authorize('supervisor', 'admin'), getDailySummary);

/**
 * @openapi
 * /api/supervisor/windows/{id}:
 *   patch:
 *     summary: Supervisor — open or close a window
 *     tags: [Supervisor]
 *     security: [{ bearerAuth: [] }]
 */
router.patch('/windows/:id', authenticate, authorize('supervisor', 'admin'), validate(updateWindowSchema), updateWindow);

/**
 * @openapi
 * /api/supervisor/windows/{id}/assign:
 *   patch:
 *     summary: Supervisor — assign a staff member to a window
 *     tags: [Supervisor]
 *     security: [{ bearerAuth: [] }]
 */
router.patch('/windows/:id/assign', authenticate, authorize('supervisor', 'admin'), validate(assignStaffSchema), assignStaff);

export default router;
