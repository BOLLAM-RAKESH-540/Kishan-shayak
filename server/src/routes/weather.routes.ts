import { Router } from 'express';
import { getWeatherData } from '../controllers/weather.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// 🌦️ GET /api/weather?lat=...&lon=... (Protected)
router.get('/', authMiddleware, getWeatherData);

export default router;
