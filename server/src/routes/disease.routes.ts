import { Router } from 'express';
import { getDiseasesByCrop, getDiseaseById } from '../controllers/disease.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Route: GET /api/diseases/crop/Paddy (Protected)
router.get('/crop/:cropName', authMiddleware, getDiseasesByCrop);

// Route: GET /api/diseases/detail/:id (Protected)
router.get('/detail/:id', authMiddleware, getDiseaseById);

export default router;