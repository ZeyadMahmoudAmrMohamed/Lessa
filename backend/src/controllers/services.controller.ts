import { Request, Response, NextFunction } from 'express';
import { ServicesService } from '../services/services.service.js';

const svc = new ServicesService();

export async function getPublicServices(req: Request, res: Response, next: NextFunction) {
  try {
    const services = await svc.getPublicServices();
    res.json({ services });
  } catch (err) {
    next(err);
  }
}
