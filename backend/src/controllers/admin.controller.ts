import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service.js';
import { ServicesService } from '../services/services.service.js';

const adminSvc = new AdminService();
const servicesSvc = new ServicesService();

export async function adminListServices(req: Request, res: Response, next: NextFunction) {
  try {
    const services = await servicesSvc.listAll();
    res.json({ services });
  } catch (err) {
    next(err);
  }
}

export async function adminCreateService(req: Request, res: Response, next: NextFunction) {
  try {
    const service = await servicesSvc.create(req.body);
    res.status(201).json({ service });
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateService(req: Request, res: Response, next: NextFunction) {
  try {
    const service = await servicesSvc.update(req.params.id, req.body);
    res.json({ service });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await adminSvc.listUsers(req.query as { page: number; limit: number; search?: string });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await adminSvc.updateUser(req.params.id, req.body);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function getReports(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminSvc.getReports(req.query as { start: string; end: string });
    res.json(data);
  } catch (err) {
    next(err);
  }
}
