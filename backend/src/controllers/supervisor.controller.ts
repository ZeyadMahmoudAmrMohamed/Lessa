import { Request, Response, NextFunction } from 'express';
import { SupervisorService } from '../services/supervisor.service.js';
import { env } from '../lib/env.js';

const svc = new SupervisorService();

export async function getBranchDashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await svc.getBranchDashboard(env.BRANCH_ID);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function updateWindow(req: Request, res: Response, next: NextFunction) {
  try {
    const window = await svc.updateWindow(req.params.id, req.body);
    res.json({ window });
  } catch (err) {
    next(err);
  }
}

export async function assignStaff(req: Request, res: Response, next: NextFunction) {
  try {
    const window = await svc.assignStaff(req.params.id, req.body.staff_id);
    res.json({ window });
  } catch (err) {
    next(err);
  }
}

export async function getDailySummary(req: Request, res: Response, next: NextFunction) {
  try {
    const date = (req.query.date as string) ?? new Date().toISOString().slice(0, 10);
    const data = await svc.getDailySummary(env.BRANCH_ID, date);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
