import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../lib/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { getPublicServices } from '../controllers/services.controller.js';
import {
  adminListServices,
  adminCreateService,
  adminUpdateService,
} from '../controllers/admin.controller.js';

const router = Router();

export const createServiceSchema = z.object({
  name_ar: z.string().min(2).max(100),
  name_en: z.string().min(2).max(100),
  estimated_duration_minutes: z.number().int().positive().max(120),
});

export const updateServiceSchema = createServiceSchema.partial().extend({
  is_active: z.boolean().optional(),
});

/**
 * @openapi
 * /api/services/public:
 *   get:
 *     summary: List active services with congestion data (no auth required)
 *     tags: [Services]
 *     responses:
 *       200: { description: List of active services with wait estimates }
 */
router.get('/public', getPublicServices);

/**
 * @openapi
 * /api/services:
 *   get:
 *     summary: Admin — list all services
 *     tags: [Admin, Services]
 *     security: [{ bearerAuth: [] }]
 *   post:
 *     summary: Admin — create service
 *     tags: [Admin, Services]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/', authenticate, authorize('admin'), adminListServices);
router.post('/', authenticate, authorize('admin'), validate(createServiceSchema), adminCreateService);
router.patch('/:id', authenticate, authorize('admin'), validate(updateServiceSchema), adminUpdateService);

export default router;
