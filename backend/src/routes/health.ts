import { Router, Request, Response } from 'express';
import { getDb } from '../db/client.js';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     description: Returns API status and DB connectivity. No auth required.
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Healthy
 *       503:
 *         description: DB unreachable
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    // Lightweight query to verify DB connectivity
    const { error } = await getDb().from('branches').select('id').limit(1);
    if (error) throw error;

    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'degraded', db: 'unreachable', timestamp: new Date().toISOString() });
  }
});

export default router;
