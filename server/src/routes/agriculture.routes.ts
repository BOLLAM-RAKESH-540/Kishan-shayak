import { Router } from 'express';
import { 
  createSoilTest, 
  getSoilTests, 
  createWasteListing, 
  getWasteListings 
} from '../controllers/agriculture.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Soil Testing
router.post('/soil', authMiddleware, createSoilTest);
router.get('/soil', authMiddleware, getSoilTests);

// Waste Utilization
router.post('/waste', authMiddleware, createWasteListing);
router.get('/waste', getWasteListings); // Public can view listings

export default router;
