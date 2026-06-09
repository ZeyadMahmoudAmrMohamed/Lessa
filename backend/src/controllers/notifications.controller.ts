import { Request, Response, NextFunction } from 'express';
import { NotificationsService } from '../services/notifications.service.js';

const svc = new NotificationsService();

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const unreadOnly = req.query.unread === 'true';
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const result = await svc.getForUser(req.user!.id, unreadOnly, page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function markAllRead(req: Request, res: Response, next: NextFunction) {
  try {
    const updated = await svc.markAllRead(req.user!.id);
    res.json({ updated });
  } catch (err) {
    next(err);
  }
}
