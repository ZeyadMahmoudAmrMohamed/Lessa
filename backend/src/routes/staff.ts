import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../lib/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import {
  getWindowQueue,
  callNext,
  updateTicketStatus,
} from '../controllers/staff.controller.js';

const router = Router();

export const ticketStatusSchema = z.object({
  status: z.enum(['done', 'skipped', 'no_show']),
});

/**
 * @openapi
 * /api/staff/window/{windowId}/queue:
 *   get:
 *     summary: Staff — get current queue for their window
 *     tags: [Staff]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/window/:windowId/queue', authenticate, authorize('staff', 'supervisor', 'admin'), getWindowQueue);

/**
 * @openapi
 * /api/staff/window/{windowId}/next:
 *   post:
 *     summary: Staff — call the next ticket in the queue
 *     tags: [Staff]
 *     security: [{ bearerAuth: [] }]
 */
router.post('/window/:windowId/next', authenticate, authorize('staff', 'supervisor', 'admin'), callNext);

/**
 * @openapi
 * /api/staff/tickets/{id}/status:
 *   patch:
 *     summary: Staff — update active ticket status (done | skipped | no_show)
 *     tags: [Staff]
 *     security: [{ bearerAuth: [] }]
 */
router.patch('/tickets/:id/status', authenticate, authorize('staff', 'supervisor', 'admin'), validate(ticketStatusSchema), updateTicketStatus);

export default router;
