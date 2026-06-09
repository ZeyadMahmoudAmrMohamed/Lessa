import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../lib/validate.js';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

export const registerSchema = z.object({
  full_name: z.string().min(2).max(100),
  phone: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, 'Invalid Egyptian phone number'),
  password: z.string().min(8).max(72),
});

export const loginSchema = z.object({
  phone: z.string().min(1),
  password: z.string().min(1),
});

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new citizen
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [full_name, phone, password]
 *             properties:
 *               full_name: { type: string }
 *               phone: { type: string, example: "01012345678" }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       201: { description: Registered successfully, returns JWT }
 *       409: { description: Phone already registered }
 */
router.post('/register', validate(registerSchema), register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login with phone and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, password]
 *             properties:
 *               phone: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful, returns JWT }
 *       401: { description: Invalid credentials }
 */
router.post('/login', validate(loginSchema), login);

export default router;
