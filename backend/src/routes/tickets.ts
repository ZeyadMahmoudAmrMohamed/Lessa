import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../lib/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import {
  getActiveTicket,
  bookTicket,
  cancelTicket,
  getTicketHistory,
} from '../controllers/tickets.controller.js';

const router = Router();

export const bookTicketSchema = z.object({
  service_id: z.string().uuid(),
});

/**
 * @openapi
 * /api/citizen/ticket/active:
 *   get:
 *     summary: Citizen — get their current active ticket with queue position
 *     tags: [Citizen]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/active', authenticate, authorize('citizen'), getActiveTicket);

/**
 * @openapi
 * /api/citizen/tickets/history:
 *   get:
 *     summary: Citizen — get recent ticket history
 *     tags: [Citizen]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/history', authenticate, authorize('citizen'), getTicketHistory);

/**
 * @openapi
 * /api/citizen/tickets:
 *   post:
 *     summary: Citizen — book a queue slot
 *     tags: [Citizen]
 *     security: [{ bearerAuth: [] }]
 */
router.post('/', authenticate, authorize('citizen'), validate(bookTicketSchema), bookTicket);

/**
 * @openapi
 * /api/citizen/tickets/{id}:
 *   delete:
 *     summary: Citizen — cancel their ticket
 *     tags: [Citizen]
 *     security: [{ bearerAuth: [] }]
 */
router.delete('/:id', authenticate, authorize('citizen'), cancelTicket);

export default router;
