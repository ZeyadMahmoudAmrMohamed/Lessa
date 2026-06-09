import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { env } from './lib/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import servicesRouter from './routes/services.js';
import ticketsRouter from './routes/tickets.js';
import citizenTicketActiveRouter from './routes/citizenTicketActive.js';
import staffRouter from './routes/staff.js';
import supervisorRouter from './routes/supervisor.js';
import adminRouter from './routes/admin.js';
import notificationsRouter from './routes/notifications.js';

export function createApp() {
  const app = express();

  // ─── Security & Parsing ───────────────────────────────────────────────────
  app.use(helmet());
  app.use(cors({
    origin: env.CORS_ORIGINS.split(',').map((o) => o.trim()),
    credentials: true,
  }));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // ─── Routes ───────────────────────────────────────────────────────────────
  app.use('/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/services', servicesRouter);
  app.use('/api/citizen/tickets', ticketsRouter);
  app.use('/api/citizen/ticket', citizenTicketActiveRouter);
  app.use('/api/citizen/notifications', notificationsRouter);
  app.use('/api/staff', staffRouter);
  app.use('/api/supervisor', supervisorRouter);
  app.use('/api/admin', adminRouter);

  // ─── Error Handling ───────────────────────────────────────────────────────
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
