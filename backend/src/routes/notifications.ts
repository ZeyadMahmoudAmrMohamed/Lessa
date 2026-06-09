import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import {
  getNotifications,
  markAllRead,
} from '../controllers/notifications.controller.js';

const router = Router();

/**
 * @openapi
 * /api/citizen/notifications:
 *   get:
 *     summary: Citizen — list in-app notifications
 *     tags: [Citizen]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: unread
 *         schema: { type: boolean }
 */
router.get('/', authenticate, authorize('citizen'), getNotifications);

/**
 * @openapi
 * /api/citizen/notifications/read-all:
 *   patch:
 *     summary: Citizen — mark all notifications as read
 *     tags: [Citizen]
 *     security: [{ bearerAuth: [] }]
 */
router.patch('/read-all', authenticate, authorize('citizen'), markAllRead);

export default router;
