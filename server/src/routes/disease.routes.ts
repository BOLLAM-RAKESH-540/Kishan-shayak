import { Router } from 'express'; // 🟢 This line was missing!
import { getDiseasesByCrop, getDiseaseById } from '../controllers/disease.controller';

const router = Router();

// Route: GET /api/diseases/crop/Paddy
router.get('/crop/:cropName', getDiseasesByCrop);

// Route: GET /api/diseases/detail/:id
router.get('/detail/:id', getDiseaseById);

export default router;