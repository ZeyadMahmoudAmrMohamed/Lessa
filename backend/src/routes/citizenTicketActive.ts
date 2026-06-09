import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { getActiveTicket } from '../controllers/tickets.controller.js';

const router = Router();

/**
 * @openapi
 * /api/citizen/ticket/active:
 *   get:
 *     summary: Citizen — get their current active ticket with queue position
 *     tags: [Citizen]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/active', authenticate, authorize('citizen'), getActiveTicket);

export default router;
