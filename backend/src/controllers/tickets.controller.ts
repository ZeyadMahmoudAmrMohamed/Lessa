import { Request, Response, NextFunction } from 'express';
import { TicketsService } from '../services/tickets.service.js';

const svc = new TicketsService();

export async function getActiveTicket(req: Request, res: Response, next: NextFunction) {
  try {
    const ticket = await svc.getActiveTicket(req.user!.id);
    res.json({ ticket });
  } catch (err) {
    next(err);
  }
}

export async function bookTicket(req: Request, res: Response, next: NextFunction) {
  try {
    const ticket = await svc.bookTicket(req.user!.id, req.body.service_id);
    res.status(201).json({ ticket });
  } catch (err) {
    next(err);
  }
}

export async function cancelTicket(req: Request, res: Response, next: NextFunction) {
  try {
    await svc.cancelTicket(req.user!.id, req.params.id);
    res.json({ message: 'تم إلغاء الحجز بنجاح' });
  } catch (err) {
    next(err);
  }
}

export async function getTicketHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const tickets = await svc.getHistory(req.user!.id);
    res.json({ tickets });
  } catch (err) {
    next(err);
  }
}
