import { Request, Response, NextFunction } from 'express';
import { StaffService } from '../services/staff.service.js';

const svc = new StaffService();

export async function getWindowQueue(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await svc.getWindowQueue(req.params.windowId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function callNext(req: Request, res: Response, next: NextFunction) {
  try {
    const ticket = await svc.callNext(req.params.windowId);
    res.json({ ticket });
  } catch (err) {
    next(err);
  }
}

export async function updateTicketStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const ticket = await svc.updateTicketStatus(req.params.id, req.body.status);
    res.json({ ticket });
  } catch (err) {
    next(err);
  }
}
